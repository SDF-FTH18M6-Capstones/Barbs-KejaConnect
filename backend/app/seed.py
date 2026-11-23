import itertools
import random
import uuid
from datetime import datetime, timezone

from faker import Faker

from . import create_app
from .config import db
from .models import *
from .utils import (
    ALLOWED_ROLES,
    APPROVAL_STATUS,
    DOC_TYPE,
    PROPERTY_TYPE,
    COUNTIES,
    INQUIRY_STATUS,
    REPORT_STATUS,
)

fake = Faker()
Faker.seed(42)
random.seed(42)

PASSWORD = "testpass"

NAIROBI_AREAS = [
    "Kilimani",
    "Westlands",
    "Lavington",
    "Kileleshwa",
    "Parklands",
    "South B",
    "Embakasi",
    "Ruaka",
    "Karen",
    "Ngong Road",
]

# Global counter: PropertyImage.position is unique=True across the whole table
position_counter = itertools.count(1)
unit_counter = itertools.count(1)
used_phones = set()

app = create_app()


def sanity_check_constants():
    for role in ("admin", "manager", "owner", "tenant"):
        assert role in ALLOWED_ROLES, f"'{role}' not in ALLOWED_ROLES: {ALLOWED_ROLES}"
    for status in ("not_required", "pending", "approved"):
        assert (
            status in APPROVAL_STATUS
        ), f"'{status}' not in APPROVAL_STATUS: {APPROVAL_STATUS}"


def unique_phone():
    while True:
        phone = f"+2547{random.randint(10000000, 99999999)}"
        if phone not in used_phones:
            used_phones.add(phone)
            return phone


def make_user(role, n, approval_status="not_required", email_verified=True):
    user = User(
        full_name=fake.name(),
        email=f"{role}{n}@example.com",
        phone=unique_phone(),
        role=role,
        email_verified=email_verified,
        approval_status=approval_status,
    )
    # password_hash is a hybrid_property, so it can't be passed to the
    # constructor kwargs - it has to be assigned after construction.
    user.password_hash = PASSWORD
    return user


def make_property(poster):
    property_type = random.choice(list(PROPERTY_TYPE))
    county = "Nairobi"
    area = random.choice(NAIROBI_AREAS)
    label = property_type.replace("_", " ").title()

    # bedrooms / bathrooms / price range depend on the property type
    if property_type in ("single_room", "bedsitter", "studio"):
        bedrooms, bathrooms = 0, 1
        low, high = 4000, 25000
        title = f"{label} in {area}"
    elif property_type == "commercial":
        bedrooms, bathrooms = None, random.randint(1, 3)
        low, high = 30000, 250000
        title = f"Commercial Space in {area}"
    else:
        bedrooms = random.randint(1, 5)
        bathrooms = max(1, bedrooms - random.randint(0, 1))
        low, high = 15000, 150000
        title = f"{bedrooms} Bedroom {label} in {area}"

    prop = Property(
        poster_id=poster.id,
        title=title,
        description=fake.text(max_nb_chars=200)[:250],
        property_type=property_type,
        price_monthly=random.randrange(low, high, 500),
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        county=county,
        area=area,
        building_name=f"{fake.last_name()} Heights",
        street_address=fake.street_address(),
        unit_number=f"U{next(unit_counter)}",
        lr_number=f"LR {random.randint(1000, 99999)}/{random.randint(1, 999)}",
    )
    return prop


def make_images(prop):
    images = []
    for i in range(random.randint(3, 5)):
        seed = uuid.uuid4().hex[:10]
        images.append(
            PropertyImage(
                property_id=prop.id,
                url=f"https://picsum.photos/seed/{seed}/1024/768",
                cloudinary_public_id=f"seed/{seed}",
                is_cover=(i == 0),
                position=next(position_counter),
            )
        )
    return images


def make_document(user, approved, reviewer):
    doc = VerificationDocument(
        user_id=user.id,
        doc_type=random.choice(list(DOC_TYPE)),
        file_url=f"https://picsum.photos/seed/{uuid.uuid4().hex[:10]}/800/1100",
        cloudinary_public_id=f"seed/docs/{uuid.uuid4().hex[:10]}",
        status="approved" if approved else "pending",
    )
    if approved:
        doc.reviewed_by = reviewer.id
        doc.reviewed_at = datetime.now(timezone.utc)
    return doc


with app.app_context():
    print("Initializing database seeding...")
    sanity_check_constants()

    # 1. Clear tables in reverse order of dependencies
    print("Clearing existing data...")
    db.session.query(Report).delete()
    db.session.query(SavedListing).delete()
    db.session.query(Inquiry).delete()
    db.session.query(PropertyImage).delete()
    db.session.query(Property).delete()
    db.session.query(VerificationDocument).delete()
    db.session.query(EmailVerificationToken).delete()
    db.session.query(User).delete()
    db.session.commit()

    # 2. Users
    print("Creating users...")
    admins = [make_user("admin", i) for i in range(1, 4)]

    managers = [
        make_user("manager", 1, approval_status="approved"),
        make_user("manager", 2, approval_status="approved"),
        make_user("manager", 3, approval_status="pending"),  # not approved yet
    ]

    owners = [
        make_user("owner", 1, approval_status="approved"),
        make_user("owner", 2, approval_status="pending"),  # not approved yet
    ]

    tenants = [
        make_user("tenant", 1),
        make_user("tenant", 2),
        make_user("tenant", 3, email_verified=False),  # email unconfirmed
    ]

    all_users = admins + managers + owners + tenants
    db.session.add_all(all_users)
    db.session.flush()  # generate IDs

    # 3. Email verification token for the unconfirmed tenant
    print("Creating email verification token...")
    unconfirmed = tenants[2]
    token = EmailVerificationToken(user_id=unconfirmed.id)
    raw_token = token.raw_token  # only available in memory, never stored
    db.session.add(token)

    # 4. Verification documents for managers and owners
    print("Creating verification documents...")
    reviewer = admins[0]
    docs = [
        make_document(managers[0], approved=True, reviewer=reviewer),
        make_document(managers[1], approved=True, reviewer=reviewer),
        make_document(managers[2], approved=False, reviewer=reviewer),
        make_document(owners[0], approved=True, reviewer=reviewer),
        make_document(owners[1], approved=False, reviewer=reviewer),
    ]
    db.session.add_all(docs)

    # 5. Properties (approved manager 1 -> 4, approved manager 2 -> 3, approved owner 1 -> 3)
    print("Creating properties...")
    property_plan = [
        (managers[0], 4),
        (managers[1], 3),
        (owners[0], 3),
    ]
    properties = []
    for poster, count in property_plan:
        for _ in range(count):
            prop = make_property(poster)
            db.session.add(prop)
            properties.append(prop)
    db.session.flush()

    # 6. Property images
    print("Creating property images...")
    for prop in properties:
        db.session.add_all(make_images(prop))

    # 7. Inquiries from tenants
    print("Creating inquiries...")
    for tenant in tenants:
        for prop in random.sample(properties, 3):
            db.session.add(
                Inquiry(
                    property_id=prop.id,
                    tenant_id=tenant.id,
                    message=fake.paragraph(nb_sentences=2),
                    status=random.choice(list(INQUIRY_STATUS)),
                )
            )

    # 8. Saved listings
    print("Creating saved listings...")
    for tenant in tenants:
        for prop in random.sample(properties, 3):
            db.session.add(SavedListing(user_id=tenant.id, property_id=prop.id))

    # 9. Reports
    print("Creating reports...")
    other_statuses = [s for s in REPORT_STATUS if s != "open"]
    db.session.add(
        Report(
            property_id=properties[0].id,
            reporter_id=tenants[0].id,
            reason="Listing photos don't match the actual property.",
            status="open",
        )
    )
    if other_statuses:
        db.session.add(
            Report(
                property_id=properties[1].id,
                reporter_id=tenants[1].id,
                reason="Price in the listing is different from what I was quoted.",
                status=other_statuses[0],
                resolved_by=admins[0].id,
            )
        )

    # 10. Commit
    db.session.commit()

    print("\nDatabase successfully seeded!")
    print(f"All passwords: '{PASSWORD}'")
    print("Accounts:")
    for u in all_users:
        print(
            f"  {u.role:<8} {u.email:<22} approval={u.approval_status:<12} "
            f"email_verified={u.email_verified}"
        )
    print(f"\nRaw email verification token for {unconfirmed.email}:\n  {raw_token}")
