"""
Trie (Prefix Tree) data structure implementation for autocomplete
"""
from typing import List, Optional


class TrieNode:
    """Node in the Trie data structure"""
    
    def __init__(self):
        self.children = {}  # Dictionary mapping character to TrieNode
        self.is_end_of_word = False  # True if this node represents the end of a word
        self.word = None  # Store the complete word at the end node (for easier retrieval)


class Trie:
    """
    Trie (Prefix Tree) implementation for efficient prefix matching and autocomplete
    
    Time Complexity:
    - Insert: O(m) where m is the length of the word
    - Search: O(m) where m is the length of the word
    - Autocomplete: O(m + k) where m is prefix length and k is number of results
    """
    
    def __init__(self):
        self.root = TrieNode()
        self.size = 0  # Number of words in the trie
    
    def insert(self, word: str) -> None:
        """
        Insert a word into the trie
        
        Args:
            word: The word to insert (case-insensitive, will be converted to lowercase)
        """
        if not word or not word.strip():
            return
        
        word = word.lower().strip()
        node = self.root
        
        # Traverse the trie, creating nodes as needed
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        # Mark the end of the word
        if not node.is_end_of_word:
            node.is_end_of_word = True
            node.word = word
            self.size += 1
    
    def search(self, word: str) -> bool:
        """
        Search for a word in the trie
        
        Args:
            word: The word to search for (case-insensitive)
            
        Returns:
            True if the word exists in the trie, False otherwise
        """
        if not word:
            return False
        
        word = word.lower().strip()
        node = self.root
        
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        
        return node.is_end_of_word
    
    def starts_with(self, prefix: str) -> bool:
        """
        Check if any word in the trie starts with the given prefix
        
        Args:
            prefix: The prefix to check (case-insensitive)
            
        Returns:
            True if any word starts with the prefix, False otherwise
        """
        if not prefix:
            return False
        
        prefix = prefix.lower().strip()
        node = self.root
        
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        
        return True
    
    def autocomplete(self, prefix: str, max_results: int = 10, contains: bool = False) -> List[str]:
        """
        Get all words that start with the given prefix (autocomplete)
        If contains=True, also search for words containing the prefix anywhere
        
        Args:
            prefix: The prefix to search for (case-insensitive)
            max_results: Maximum number of results to return (default: 10)
            contains: If True, also match words containing the prefix (default: False)
            
        Returns:
            List of words that start with (or contain) the prefix, limited to max_results
        """
        if not prefix:
            return []
        
        prefix = prefix.lower().strip()
        results = []
        
        # First, try exact prefix match
        node = self.root
        found_prefix = True
        
        # Navigate to the node representing the prefix
        for char in prefix:
            if char not in node.children:
                found_prefix = False
                break
            node = node.children[char]
        
        if found_prefix:
            # We found the prefix, collect words starting with it
            self._collect_words(node, prefix, results, max_results)
        
        # If contains=True and we need more results, search all words
        if contains and len(results) < max_results:
            all_words = self.get_all_words()
            prefix_lower = prefix.lower()
            for word in all_words:
                word_lower = word.lower()
                if prefix_lower in word_lower and word_lower not in [r.lower() for r in results]:
                    results.append(word)
                    if len(results) >= max_results:
                        break
        
        return results
    
    def _collect_words(self, node: TrieNode, current_prefix: str, results: List[str], max_results: int) -> None:
        """
        Helper method to recursively collect all words from a node
        
        Args:
            node: Current node in the trie
            current_prefix: Current prefix built so far
            results: List to store results
            max_results: Maximum number of results to collect
        """
        if len(results) >= max_results:
            return
        
        # If this node marks the end of a word, add it to results
        if node.is_end_of_word and node.word:
            results.append(node.word)
        
        # Recursively search all children
        for char, child_node in sorted(node.children.items()):
            if len(results) >= max_results:
                break
            self._collect_words(child_node, current_prefix + char, results, max_results)
    
    def get_all_words(self) -> List[str]:
        """
        Get all words stored in the trie
        
        Returns:
            List of all words in the trie
        """
        results = []
        self._collect_words(self.root, "", results, float('inf'))
        return results
    
    def clear(self) -> None:
        """Clear all words from the trie"""
        self.root = TrieNode()
        self.size = 0
    
    def __len__(self) -> int:
        """Return the number of words in the trie"""
        return self.size
    
    def __contains__(self, word: str) -> bool:
        """Check if a word is in the trie using 'in' operator"""
        return self.search(word)

