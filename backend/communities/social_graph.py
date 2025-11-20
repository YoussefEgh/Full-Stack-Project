from config.firestore import get_firestore_client
from config.data_structures.union_find import UnionFind

def build_social_clusters():
    """
    Build social clusters of users based on interactions:
    - author_uid of a post
    - user_uid of replies to that post

    If user B replies to user A's post, we union(A, B).
    Result: clusters of users who interact with each other.
    """
    db = get_firestore_client()
    uf = UnionFind()

    # Map each post_id -> author_uid
    post_authors = {}
    posts = db.collection("posts").stream()
    for post in posts:
        data = post.to_dict() or {}
        post_id = data.get("id") or post.id
        author_uid = data.get("author_uid")

        if not post_id or not author_uid:
            continue

        post_authors[post_id] = author_uid
        uf.add(author_uid)

    # For every reply, connect reply.user_uid with the post's author_uid
    replies = db.collection("replies").stream()
    for reply in replies:
        rdata = reply.to_dict() or {}
        post_id = rdata.get("post_id")
        user_uid = rdata.get("user_uid")

        if not post_id or not user_uid:
            continue

        author_uid = post_authors.get(post_id)
        if not author_uid:
            # reply to a post we didn't map (shouldn't happen often)
            continue

        uf.add(user_uid)
        uf.union(author_uid, user_uid)

    # Convert Union-Find structure into a list of clusters
    components = uf.get_components()  # {root: [uids]}
    clusters = list(components.values())

    return clusters
