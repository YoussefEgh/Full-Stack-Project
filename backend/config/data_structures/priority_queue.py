from typing import Any, List, Tuple, Optional

class PriorityQueue:
    def __init__(self):
        # We'll store as list of tuples (priority, item)
        # Use 0-indexed array for heap
        self._heap: List[Tuple[int, Any]] = []

    def __len__(self):
        return len(self._heap)

    def is_empty(self) -> bool:
        return len(self._heap) == 0

    def push(self, item: Any, priority: int):
        """Insert item with numeric priority. Higher numbers = higher priority."""
        self._heap.append((priority, item))
        self._sift_up(len(self._heap) - 1)

    def peek(self) -> Optional[Tuple[int, Any]]:
        if self.is_empty():
            return None
        return self._heap[0]

    def pop(self) -> Optional[Tuple[int, Any]]:
        if self.is_empty():
            return None
        root = self._heap[0]
        last = self._heap.pop()
        if self._heap:
            self._heap[0] = last
            self._sift_down(0)
        return root

    def as_list(self) -> List[Tuple[int, Any]]:
        # Return a shallow copy of the underlying heap list
        return list(self._heap)

    # -- internal helpers --
    def _sift_up(self, idx: int):
        while idx > 0:
            parent = (idx - 1) // 2
            if self._heap[idx][0] > self._heap[parent][0]:
                self._heap[idx], self._heap[parent] = self._heap[parent], self._heap[idx]
                idx = parent
            else:
                break

    def _sift_down(self, idx: int):
        n = len(self._heap)
        while True:
            left = 2 * idx + 1
            right = left + 1
            largest = idx
            if left < n and self._heap[left][0] > self._heap[largest][0]:
                largest = left
            if right < n and self._heap[right][0] > self._heap[largest][0]:
                largest = right
            if largest == idx:
                break
            self._heap[idx], self._heap[largest] = self._heap[largest], self._heap[idx]
            idx = largest