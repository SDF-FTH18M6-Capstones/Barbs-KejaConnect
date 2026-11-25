import socket

import pytest


def test_network_is_blocked():
    with pytest.raises(RuntimeError):
        socket.socket().connect(("127.0.0.1", 9))