from config.firestore import get_firestore_client
from config.data_structures.union_find import UnionFind

def build_social_clusters_expanded():
    """
    Builds clusters of interacting users using Union-Find,
    then fetches full user documents from Firestore.
    """
    db = get_firestore_client()
    uf = UnionFind()

    # Step 1: Build mapping from post_id -> author_uid
    post_authors = {}
    posts = db.collection("posts").stream()
    for post in posts:
        data = post.to_dict() or {}
        post_id = data.get("id") or post.id
        author_uid = data.get("author_uid")
        if post_id and author_uid:
            post_authors[post_id] = author_uid
            uf.add(author_uid)

    # Step 2: Connect reply users with post authors
    replies = db.collection("replies").stream()
    for reply in replies:
        rdata = reply.to_dict() or {}
        post_id = rdata.get("post_id")
        user_uid = rdata.get("user_uid")

        if not post_id or not user_uid:
            continue

        author_uid = post_authors.get(post_id)
        if author_uid:
            uf.add(user_uid)
            uf.union(author_uid, user_uid)

    # Step 3: Convert clusters of UIDs
    raw_clusters = uf.get_components()   # dict: root -> [uids]
    clusters = list(raw_clusters.values())

    # Step 4: For each UID fetch full user profile
    user_collection = db.collection("users")   # ⬅️ you confirmed this name

    expanded = []
    for group in clusters:
        members = []
        for uid in group:
            user_doc = user_collection.document(uid).get()
            if user_doc.exists:
                members.append(user_doc.to_dict())
        expanded.append(members)

    return expanded
