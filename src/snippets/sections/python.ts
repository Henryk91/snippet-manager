import { RawSection } from "../../types/types";

const section: RawSection = {
  id: "python",
  label: "Python",
  identifier: "bash",
  snippets: [
    {
      title: "Create & activate venv",
      description: "Isolated environment with stdlib venv:",
      markdown: `python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows (PowerShell):
.venv\\Scripts\\Activate.ps1`,
    },
    {
      title: "Install & freeze deps",
      description: "Install packages and pin exact versions:",
      markdown: `pip install requests pytest
pip freeze > requirements.txt`,
    },
    {
      title: "Format & lint",
      description: "Auto-format and lint (Black + Ruff):",
      markdown: `pip install black ruff
black .
ruff check .`,
    },
    {
      title: "Script skeleton with argparse",
      description: "Command-line args with helpful --help:",
      markdown: `# app.py
import argparse

def main():
    p = argparse.ArgumentParser(prog="app", description="Demo CLI")
    p.add_argument("path", help="input file path")
    p.add_argument("--limit", type=int, default=10, help="max items")
    args = p.parse_args()
    print(args.path, args.limit)

if __name__ == "__main__":
    main()`,
    },
    {
      title: "Logging setup",
      description: "Module-level logger; INFO by default:",
      markdown: `# log_demo.py
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

def work():
    logger.info("Starting work...")
    logger.debug("Debug details")  # visible if level=DEBUG

if __name__ == "__main__":
    work()`,
    },
    {
      title: "Dataclass model",
      description: "Lightweight data container with defaults:",
      markdown: `from dataclasses import dataclass, field
from typing import List

@dataclass
class Post:
    title: str
    tags: List[str] = field(default_factory=list)
    published: bool = False

p = Post("Hello", ["intro"])
print(p)`,
    },
    {
      title: "Basic Python class",
      description: "Example of a normal Python class with instance and class methods.",
      markdown: `class Post:
    # class attribute shared by all instances
    all_posts = []

    def __init__(self, title: str, author: str, published: bool = False):
        self.title = title
        self.author = author
        self.published = published
        # automatically add to class list
        Post.all_posts.append(self)

    def publish(self):
        self.published = True
        print(f"Post '{self.title}' published!")

    def __str__(self):
        status = "✅ Published" if self.published else "📝 Draft"
        return f"{self.title} by {self.author} ({status})"

    @classmethod
    def get_published(cls):
        """Return all posts marked as published."""
        return [p for p in cls.all_posts if p.published]

    @staticmethod
    def word_count(text: str) -> int:
        """Static helper method."""
        return len(text.split())

# Example usage
p1 = Post("Intro to Python", "Alice")
p2 = Post("Advanced Tips", "Bob", published=True)

p1.publish()
print(p1)
print(Post.get_published())
print(Post.word_count("Python is great"))`,
    },
    {
      title: "Dataclass with methods",
      description: "Same class rewritten as a dataclass, including class, static, and instance methods.",
      markdown: `from dataclasses import dataclass, field
from typing import ClassVar, List

@dataclass
class Post:
    title: str
    author: str
    published: bool = False

    # Class variable (shared by all instances)
    all_posts: ClassVar[List["Post"]] = []

    def __post_init__(self):
        # Automatically add to shared list after initialization
        Post.all_posts.append(self)

    def publish(self):
        self.published = True
        print(f"Post '{self.title}' published!")

    def __str__(self):
        status = "✅ Published" if self.published else "📝 Draft"
        return f"{self.title} by {self.author} ({status})"

    @classmethod
    def get_published(cls) -> List["Post"]:
        """Return all posts marked as published."""
        return [p for p in cls.all_posts if p.published]

    @staticmethod
    def word_count(text: str) -> int:
        """Static helper method."""
        return len(text.split())

# Example usage
p1 = Post("Intro to Python", "Alice")
p2 = Post("Advanced Tips", "Bob", published=True)

p1.publish()
print(p1)
print(Post.get_published())
print(Post.word_count("Python is great"))`,
    },

    {
      title: "Read & write JSON",
      description: "Use pathlib + json; ensure UTF-8:",
      markdown: `from pathlib import Path
import json

data = {"hello": "world", "n": 3}
Path("out.json").write_text(json.dumps(data, indent=2), encoding="utf-8")

raw = Path("out.json").read_text(encoding="utf-8")
obj = json.loads(raw)
print(obj["hello"])`,
    },
    {
      title: "Pathlib file ops",
      description: "Find files and read safely:",
      markdown: `from pathlib import Path

root = Path(".")
for p in root.rglob("*.py"):
    if p.is_file():
        print(p.relative_to(root))`,
    },
    {
      title: "Subprocess (safe)",
      description: "Run command; raise if it fails;",
      markdown: `import subprocess

res = subprocess.run(
    ["git", "status", "--porcelain"],
    check=True,
    text=True,
    capture_output=True,
)
print(res.stdout)`,
    },
    {
      title: "Datetime with timezone",
      description: "Use zoneinfo for aware datetimes:",
      markdown: `from datetime import datetime
from zoneinfo import ZoneInfo

now_utc = datetime.now(tz=ZoneInfo("UTC"))
now_jhb = now_utc.astimezone(ZoneInfo("Africa/Johannesburg"))
print(now_utc.isoformat(), now_jhb.isoformat())`,
    },
    {
      title: "Typing essentials",
      description: "Type hints for clarity & tooling:",
      markdown: `from typing import Iterable, List, Dict

def dedup(xs: Iterable[str]) -> List[str]:
    seen: Dict[str, None] = {}
    for x in xs:
        if x not in seen:
            seen[x] = None
    return list(seen.keys())`,
    },
    {
      title: "Asyncio basics",
      description: "Run tasks concurrently; await results:",
      markdown: `import asyncio

async def job(n: int) -> int:
    await asyncio.sleep(0.1)
    return n * 2

async def main():
    results = await asyncio.gather(*(job(i) for i in range(5)))
    print(results)

asyncio.run(main())`,
    },
    {
      title: "CSV read & write",
      description: "Stdlib csv with newline handling:",
      markdown: `import csv
from pathlib import Path

rows = [{"name": "A", "n": 1}, {"name": "B", "n": 2}]
with Path("out.csv").open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["name","n"])
    w.writeheader()
    w.writerows(rows)

with Path("out.csv").open("r", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row)`,
    },
    {
      title: "HTTP GET with timeout",
      description: "Requests with timeout & error handling:",
      markdown: `import requests

try:
    r = requests.get("https://httpbin.org/get", timeout=5)
    r.raise_for_status()
    print(r.json())
except requests.RequestException as e:
    print("HTTP error:", e)`,
    },
    {
      title: "Comprehensions cheat",
      description: "Lists, sets, dicts, enumerate:",
      markdown: `nums = [1, 2, 3, 4]
squares = [n*n for n in nums]
evens = {n for n in nums if n % 2 == 0}
index_map = {i: v for i, v in enumerate(nums)}
print(squares, evens, index_map)`,
    },
    {
      title: "Environment variables",
      description: "Read env with defaults:",
      markdown: `import os

dsn = os.getenv("DATABASE_URL", "sqlite:///local.db")
debug = os.getenv("DEBUG", "0") == "1"
print(dsn, debug)`,
    },
    {
      title: "Run tests (pytest)",
      description: "Quick TDD loop with pytest:",
      markdown: `pip install pytest
pytest -q`,
    },
    {
      title: "Package in editable mode",
      description: "Install your package locally for dev:",
      markdown: `pip install -e .`,
    },
    {
      title: "Basic string methods",
      description: "Common string operations and formatting:",
      markdown: `text = "  Hello World  "

print(text.strip())            # remove whitespace
print(text.lower())            # to lowercase
print(text.upper())            # to uppercase
print(text.replace("World", "Python"))
print("python".startswith("py"))
print("python".endswith("on"))
print("a,b,c".split(","))      # ['a', 'b', 'c']
print(" ".join(["fast", "api"]))  # 'fast api'
print(f"Hello {'World'.upper()}!")  # f-string`,
    },
    {
      title: "List methods",
      description: "Common list operations:",
      markdown: `nums = [3, 1, 2]
nums.append(4)
nums.sort()
nums.reverse()
nums.remove(1)
print(nums)      # [4, 3, 2]
print(nums.pop())  # removes and returns last
nums.extend([10, 20])
print(nums.count(2))
print(nums.index(3))`,
    },
    {
      title: "Dictionary methods",
      description: "Work with key/value pairs efficiently:",
      markdown: `user = {"name": "Alice", "age": 25}

print(user.keys())      # dict_keys(['name', 'age'])
print(user.values())    # dict_values(['Alice', 25])
print(user.items())     # dict_items([('name', 'Alice'), ('age', 25)])
print(user.get("age", 0))
user.update({"age": 26, "city": "Berlin"})
age = user.pop("age")   # removes and returns value
print(age, user)`,
    },
    {
      title: "Set methods",
      description: "Eliminate duplicates and compute intersections:",
      markdown: `a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # union
print(a & b)  # intersection
print(a - b)  # difference
print(a ^ b)  # symmetric difference
print(len(a))
a.add(10)
a.discard(3)`,
    },
    {
      title: "Sorting with key functions",
      description: "Use lambda or attrgetter to control sorting:",
      markdown: `data = ["banana", "apple", "cherry"]
print(sorted(data))  # alphabetical
print(sorted(data, key=len))  # by length

from operator import itemgetter
pairs = [{"n": 2}, {"n": 5}, {"n": 1}]
print(sorted(pairs, key=itemgetter("n")))`,
    },
    {
      title: "Enumerate and zip",
      description: "Loop with index or combine iterables:",
      markdown: `colors = ["red", "green", "blue"]
for i, c in enumerate(colors, start=1):
    print(i, c)

names = ["Alice", "Bob"]
ages = [25, 30]
for n, a in zip(names, ages):
    print(f"{n} is {a}")`,
    },
    {
      title: "Unpacking & starred expressions",
      description: "Unpack lists, tuples, and dicts easily:",
      markdown: `a, b, *rest = [1, 2, 3, 4]
print(a, b, rest)   # 1 2 [3,4]

first, *_, last = [10, 20, 30, 40]
print(first, last)

data = {"x": 1, "y": 2}
new = {**data, "z": 3}
print(new)`,
    },
    {
      title: "List comprehensions & generators",
      description: "Concise way to build collections:",
      markdown: `nums = [1, 2, 3, 4]
squares = [n*n for n in nums]
evens = [n for n in nums if n % 2 == 0]
gen = (n*n for n in range(5))  # generator
print(sum(gen))`,
    },

    // ==== Files & Contexts ====
    {
      title: "Read & write text files",
      description: "Safely open files using context manager:",
      markdown: `# write
with open("demo.txt", "w", encoding="utf-8") as f:
    f.write("Hello file!\\n")

# read
with open("demo.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)`,
    },
    {
      title: "Custom context manager",
      description: "Use contextlib to manage setup/teardown:",
      markdown: `from contextlib import contextmanager

@contextmanager
def log_step(name):
    print(f"Starting {name}")
    yield
    print(f"Finished {name}")

with log_step("task"):
    print("...running...")`,
    },

    // ==== Error Handling & Functions ====
    {
      title: "Try/except/else/finally",
      description: "Handle errors and cleanup gracefully:",
      markdown: `try:
    x = 1 / 0
except ZeroDivisionError as e:
    print("Error:", e)
else:
    print("No error")
finally:
    print("Always runs")`,
    },
    {
      title: "Lambda and map/filter",
      description: "Functional-style quick transforms:",
      markdown: `nums = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x*x, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))
print(squared, evens)`,
    },
    {
      title: "Decorators",
      description: "Wrap functions to extend behavior:",
      markdown: `def log_call(fn):
    def wrapper(*args, **kwargs):
        print("Calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@log_call
def greet(name):
    print("Hello", name)

greet("Alice")`,
    },
    {
      title: "Itertools & generators",
      description: "Infinite or complex iterator utilities:",
      markdown: `import itertools

for i in itertools.islice(itertools.count(10, 2), 5):
    print(i)  # 10,12,14,16,18

# chain multiple iterables
for x in itertools.chain([1, 2], [3, 4]):
    print(x)`,
    },

    // ==== Data & Common Utilities ====
    {
      title: "Defaultdict and Counter",
      description: "Auto-create keys and count items easily:",
      markdown: `from collections import defaultdict, Counter

counts = Counter("banana")
print(counts)  # Counter({'a':3,'n':2,'b':1})

groups = defaultdict(list)
groups["fruit"].append("apple")
print(groups)`,
    },
    {
      title: "Namedtuple example",
      description: "Lightweight immutable objects with names:",
      markdown: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y)`,
    },
    {
      title: "Pretty-print data structures",
      description: "Make nested structures readable:",
      markdown: `from pprint import pprint

data = {"users": [{"id": 1, "name": "Alice"}]}
pprint(data, sort_dicts=False)`,
    },
    {
      title: "Datetime and timedelta",
      description: "Add or subtract time durations:",
      markdown: `from datetime import datetime, timedelta

now = datetime.now()
week_ago = now - timedelta(days=7)
print(week_ago.strftime("%Y-%m-%d"))`,
    },
    {
      title: "Regex quick reference",
      description: "Find and replace text patterns:",
      markdown: `import re
text = "Contact: user@example.com"
match = re.search(r"[\\w.-]+@[\\w.-]+", text)
print(match.group(0))

replaced = re.sub(r"example", "gmail", text)
print(replaced)`,
    },
  ],
};

export default section;
