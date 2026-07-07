---

title: "Mastering the LRU Cache: Design, Implementation, Internals, and Real-World Applications"
date: "2026-07-08"
excerpt: "A complete guide to understanding the Least Recently Used (LRU) Cache—from fundamentals and design decisions to production use cases, interview questions, and implementation in O(1)."
tags: [algorithms, data-structures, system-design, caching]
featured: true
---

![LRU Cache Data Structure](https://cdn.hashnode.com/res/hashnode/image/upload/v1655812960691/pqAZ20NyS.png)



# Mastering the LRU Cache

Caching is one of the most powerful techniques used in software engineering. Whether you're opening Instagram, searching on Google, loading a webpage, or calling an API, chances are a cache is involved somewhere.

Among all cache eviction strategies, **Least Recently Used (LRU)** is by far the most commonly used because it closely matches how users typically access data: **recently accessed data is likely to be accessed again.**

In this article, we'll build an LRU Cache from scratch, understand why it works, analyze its complexity, compare it with other caching strategies, and explore real-world production use cases.

---

# Table of Contents

1. What is Caching?
2. Why Do We Need Cache Eviction?
3. What is LRU?
4. Real World Example
5. Cache Workflow
6. Requirements of an Efficient LRU Cache
7. Data Structures Used
8. Why a HashMap Alone Isn't Enough
9. Why a Linked List Alone Isn't Enough
10. Combining Both Data Structures
11. Designing the Doubly Linked List
12. Dummy Nodes Explained
13. Complete Python Implementation
14. Dry Run
15. Complexity Analysis
16. Why Every Operation is O(1)
17. Production Use Cases
18. LRU vs Other Eviction Policies
19. Thread Safety Considerations
20. Distributed Cache Considerations
21. Common Interview Questions
22. Common Mistakes
23. Variations of LRU
24. Python's OrderedDict Implementation
25. Key Takeaways

---

# What is Caching?

A **cache** is a temporary storage layer that stores frequently accessed data so future requests can be served much faster.

Instead of repeatedly performing expensive operations like:

* Database queries
* API requests
* File reads
* Image processing
* Machine Learning inference
* Authentication lookups

the application first checks the cache.

```
User Request
      │
      ▼
 Check Cache
   │      │
Hit      Miss
 │         │
 │     Fetch from DB
 │         │
 ▼         ▼
Return   Store in Cache
```

The goal is simple:

> **Trade memory for speed.**

---

# Why Do We Need Cache Eviction?

Memory is limited.

Suppose your cache capacity is:

```
Capacity = 3
```

Current cache:

```
A B C
```

Now a new item arrives:

```
D
```

Where should we put it?

We must remove one item.

This is called an **Eviction Policy**.

Different systems use different strategies.

Some common policies include:

* FIFO
* LRU
* LFU
* Random
* MRU
* ARC
* TinyLFU

Among these, LRU is the most widely used.

---

# What is LRU?

LRU stands for:

> **Least Recently Used**

Whenever the cache becomes full, we remove the item that has not been accessed for the longest time.

Example:

```
Capacity = 4

Access Order

A
A B
A B C
A B C D

Access B

A C D B

Access C

A D B C

Insert E

D is newest?
No.

A has not been used for longest.

Remove A

Cache:

D B C E
```

---

# Real World Example

Imagine your desk can hold only **five books**.

Whenever you read a book:

* You place it on top.
* Older books slowly move downward.

When a sixth book arrives:

You throw away the book at the bottom because it hasn't been touched in the longest time.

That is exactly how LRU works.

---

# Cache Workflow

```
Request

      │
      ▼

HashMap Lookup

      │
 ┌────┴────┐
 │         │
Hit      Miss
 │         │
 ▼         ▼
Move     Fetch Data
to Head     │
 │           ▼
 ▼      Insert at Head
Return
```

---

# Requirements of an Efficient LRU Cache

We want:

```
get(key)

O(1)
```

```
put(key)

O(1)
```

Anything slower defeats the purpose of caching.

---

# Why a HashMap Alone Isn't Enough

A HashMap gives us:

```
Lookup

O(1)
```

Example:

```
cache = {
    1 : value,
    2 : value,
    3 : value
}
```

Finding a key is fast.

But:

Can we know which key is least recently used?

No.

HashMaps do not preserve usage order.

---

# Why a Linked List Alone Isn't Enough

A linked list stores ordering perfectly.

```
Head

A -> B -> C -> D

Tail
```

But searching for a key requires traversing the list.

```
O(n)
```

Too slow.

---

# Combining Both

We combine:

HashMap

*

Doubly Linked List

HashMap provides:

```
Key → Node
```

Linked List provides:

```
Most Recent

↓

Least Recent
```

Together we achieve:

| Operation | Complexity |
| --------- | ---------- |
| Lookup    | O(1)       |
| Delete    | O(1)       |
| Insert    | O(1)       |
| Move      | O(1)       |

---

# Why Doubly Linked List?

Suppose we have

```
A <-> B <-> C
```

We want to remove B.

Using previous pointer:

```
A.next = C
C.prev = A
```

Done.

O(1)

With a singly linked list we first need to find A.

That costs O(n).

Hence doubly linked list.

---

# Designing the Node

```python
class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value

        self.prev = None
        self.next = None
```

Each node stores:

* key
* value
* previous pointer
* next pointer

---

# Dummy Nodes

Instead of worrying about:

* Empty list
* One node
* First node
* Last node

We create two fake nodes.

```
Head <-> Tail
```

Actual nodes always stay between them.

Example

```
Head

↓

Head <-> A <-> B <-> C <-> Tail

                              ↑

                          Least Recent
```

Benefits:

* No null checks
* Cleaner code
* Fewer bugs

---

# Complete Python Implementation

```python
class Node:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:

    def __init__(self, capacity: int):

        self.capacity = capacity
        self.cache = {}

        self.head = Node(0, 0)
        self.tail = Node(0, 0)

        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):

        prev = node.prev
        nxt = node.next

        prev.next = nxt
        nxt.prev = prev

    def _add_to_head(self, node):

        node.next = self.head.next
        node.prev = self.head

        self.head.next.prev = node
        self.head.next = node

    def get(self, key):

        if key not in self.cache:
            return -1

        node = self.cache[key]

        self._remove(node)
        self._add_to_head(node)

        return node.value

    def put(self, key, value):

        if key in self.cache:
            self._remove(self.cache[key])

        node = Node(key, value)

        self.cache[key] = node

        self._add_to_head(node)

        if len(self.cache) > self.capacity:

            lru = self.tail.prev

            self._remove(lru)

            del self.cache[lru.key]
```

---

# Dry Run

Capacity = 3

```
put(1)

1
```

```
put(2)

2 1
```

```
put(3)

3 2 1
```

```
get(1)

1 3 2
```

```
put(4)

Remove 2

4 1 3
```

Everything works in O(1).

---

# Why Every Operation is O(1)

## Get

HashMap lookup

```
O(1)
```

Remove node

```
O(1)
```

Insert at head

```
O(1)
```

Total

```
O(1)
```

---

## Put

HashMap insertion

```
O(1)
```

Linked list insertion

```
O(1)
```

Eviction

```
O(1)
```

Total

```
O(1)
```

---

# Complexity Analysis

| Operation | Time |
| --------- | ---- |
| get       | O(1) |
| put       | O(1) |
| delete    | O(1) |
| update    | O(1) |

Space

```
O(capacity)
```

---

# Real World Use Cases

## 1. Browser Cache

Recently visited pages stay in memory.

Old pages are removed first.

Chrome, Firefox and Edge all use LRU-inspired cache management.

---

## 2. Operating System Page Replacement

Operating systems maintain memory pages.

Recently accessed pages remain in RAM.

Older pages are swapped to disk.

---

## 3. Database Buffer Pool

Databases like MySQL, PostgreSQL and SQL Server keep frequently accessed disk pages in memory.

Older pages are evicted.

---

## 4. Redis

Redis supports LRU-based eviction when configured with policies such as `allkeys-lru` or `volatile-lru`.

---

## 5. CDN

Cloudflare

Akamai

Fastly

Edge servers keep popular content.

Unused content eventually disappears.

---

## 6. API Gateway

Responses from expensive APIs remain cached.

Older responses are evicted.

---

## 7. DNS Resolver

Frequently resolved domains stay cached.

Unused domains expire.

---

## 8. Image Processing

Frequently viewed thumbnails stay cached.

Older images are removed.

---

## 9. Machine Learning

Large models cache embeddings.

Frequently requested vectors remain in memory.

---

## 10. IDEs

VS Code

IntelliJ

Android Studio

Recent files, syntax trees and indexes are cached.

---

## 11. JVM

JVMs cache reflection metadata, loaded classes, and compiled code using eviction strategies inspired by recency.

---

## 12. Spring Boot

Spring Cache (with providers like Caffeine) often uses LRU-inspired or Window TinyLFU eviction to keep frequently accessed data in memory.

---

# LRU vs Other Policies

| Policy | Removes               |
| ------ | --------------------- |
| FIFO   | Oldest inserted       |
| LRU    | Least recently used   |
| LFU    | Least frequently used |
| Random | Random item           |
| MRU    | Most recently used    |

---

# LRU Advantages

✅ Very simple

✅ Fast

✅ O(1)

✅ Predictable

✅ Great locality

---

# LRU Disadvantages

❌ Doesn't consider frequency.

Example:

One item accessed 1000 times yesterday.

Not used today.

It may still be evicted.

---

# When LRU is Not Ideal

Streaming workloads.

Example:

```
Read

1
2
3
4
5
6
7
8
9
...
```

Every page is accessed once.

LRU keeps replacing everything.

Almost every lookup becomes a miss.

---

# Variations of LRU

Modern systems often extend classic LRU.

## Segmented LRU (SLRU)

Separates recently seen items from frequently reused items.

---

## 2Q Cache

Uses two queues to avoid cache pollution from one-time accesses.

---

## ARC (Adaptive Replacement Cache)

Balances recency and frequency automatically.

---

## TinyLFU

Used by the Caffeine Java caching library.

Combines admission policies with frequency estimation for better hit rates.

---

# Thread Safety

Our implementation is **not thread-safe**.

In multithreaded environments:

* protect the HashMap and linked list with locks,
* use concurrent data structures,
* or rely on production-grade cache libraries.

Examples:

* Java: Caffeine
* Guava Cache
* ConcurrentHashMap + synchronization
* Python: threading.Lock around cache operations

---

# Distributed Cache Considerations

When running multiple application instances, each server's in-memory LRU cache is isolated.

To share cached data across instances, teams commonly use distributed caches such as Redis or Memcached.

Trade-offs include:

* Network latency
* Data consistency
* Replication
* Cache invalidation
* Eviction synchronization

---

# Common Interview Questions

### Why do we need both HashMap and Linked List?

HashMap gives O(1) lookup.

Linked List maintains usage order.

---

### Why Doubly Linked List?

Deletion in O(1).

---

### Why store key inside Node?

During eviction we remove the node from the linked list.

We also need to remove its entry from the HashMap.

Without storing the key we cannot delete it efficiently.

---

### Why Dummy Nodes?

Cleaner code.

No edge cases.

---

### Can we implement LRU using only HashMap?

No.

HashMap cannot maintain usage ordering.

---

### Can we implement LRU using only Linked List?

Possible.

But lookup becomes O(n).

---

### Why move node to head after get()?

Because it has just been used.

It becomes the most recently used.

---

# Common Mistakes

* Forgetting to update both the HashMap and linked list.
* Creating duplicate nodes when updating an existing key.
* Not removing the least recently used node from the HashMap during eviction.
* Mishandling edge cases without dummy nodes.
* Ignoring thread safety in concurrent environments.

---

# Python's OrderedDict Implementation

Python's `OrderedDict` already maintains insertion order and allows moving keys efficiently.

```python
from collections import OrderedDict

class CompactLRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1

        self.cache.move_to_end(key)

        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)

        self.cache[key] = value

        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

While this is concise and suitable for many Python applications, implementing the data structures yourself is essential for interviews because it demonstrates your understanding of linked lists, hash maps, and complexity analysis.

---

# Key Takeaways

* An LRU Cache removes the **least recently used** item when full.
* Achieving **O(1)** `get()` and `put()` requires **both** a HashMap and a Doubly Linked List.
* The HashMap provides constant-time lookups, while the linked list maintains recency order.
* Dummy head and tail nodes simplify insertion and deletion logic.
* LRU is widely used in browsers, operating systems, databases, CDNs, API gateways, JVMs, IDEs, and backend services.
* Although classic LRU is powerful, production systems often adopt enhanced algorithms like **TinyLFU**, **ARC**, or **SLRU** for better cache hit rates under complex workloads.

Mastering the LRU Cache not only prepares you for coding interviews but also provides insight into how high-performance systems manage memory efficiently in the real world.
