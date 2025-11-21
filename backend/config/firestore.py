"""
Firestore helper functions
"""
from config.firebase import get_firestore_client as _get_firestore_client

# Re-export get_firestore_client so it can be imported from this module
def get_firestore_client():
    """Get Firestore client instance - wrapper to ensure proper import"""
    return _get_firestore_client()

__all__ = ['get_firestore_client', 'get_collection', 'get_document', 'create_document', 'update_document', 'delete_document', 'query_collection']

def get_collection(collection_name):
    """
    Get a Firestore collection reference
    """
    db = get_firestore_client()
    return db.collection(collection_name)

def get_document(collection_name, doc_id):
    """
    Get a specific document from a collection
    """
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document(doc_id)
    doc = doc_ref.get()
    return doc.to_dict() if doc.exists else None

def create_document(collection_name, doc_id, data):
    """
    Create a new document in a collection
    """
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document(doc_id)
    doc_ref.set(data)
    return doc_ref.get().to_dict()

def update_document(collection_name, doc_id, updates):
    """
    Update a document in a collection
    """
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document(doc_id)
    doc_ref.update(updates)
    return doc_ref.get().to_dict()

def delete_document(collection_name, doc_id):
    """
    Delete a document from a collection
    """
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document(doc_id)
    doc_ref.delete()
    return True

def query_collection(collection_name, filters=None, order_by=None, limit=None):
    """
    Query a collection with optional filters, ordering, and limit
    """
    db = get_firestore_client()
    query = db.collection(collection_name)
    
    if filters:
        for field, operator, value in filters:
            query = query.where(field, operator, value)
    
    if order_by:
        field, direction = order_by
        query = query.order_by(field, direction=direction)
    
    if limit:
        query = query.limit(limit)
    
    docs = query.stream()
    return [doc.to_dict() for doc in docs]

