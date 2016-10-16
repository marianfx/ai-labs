"""Do small operations on time."""

import time


def ctime_millis():
    """:returns: Current time in milliseconds."""
    return int(round(time.time() * 1000))


def nice_time(millis):
    """:returns: Nice displaying of time."""
    return "{m} mins, {s} seconds, {mm} millis".format(
        m=str(millis // 1000 // 60),
        s=str(millis // 1000 % 60),
        mm=str(millis % 1000))
