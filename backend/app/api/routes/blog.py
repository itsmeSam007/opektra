from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.core.database import get_db
from app.models import BlogPost, User
from app.schemas import BlogPostCreate, BlogPostOut, BlogPostUpdate
from app.services import blog as blog_service

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=list[BlogPostOut])
def list_posts(published_only: bool = True, db: Session = Depends(get_db)):
    if published_only:
        return blog_service.list_published(db)
    q = db.query(BlogPost).order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc())
    return [BlogPostOut.model_validate(p) for p in q.all()]


@router.get("/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = blog_service.get_by_slug(db, slug)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("", response_model=BlogPostOut)
def create_post(data: BlogPostCreate, db: Session = Depends(get_db), _: User = Depends(require_permission("blog:write"))):
    p = BlogPost(**data.model_dump())
    if p.is_published:
        p.published_at = datetime.now(timezone.utc)
    db.add(p)
    db.commit()
    db.refresh(p)
    blog_service.invalidate_blog_cache(p.slug)
    return BlogPostOut.model_validate(p)


@router.put("/{post_id}", response_model=BlogPostOut)
def update_post(
    post_id: int, data: BlogPostUpdate, db: Session = Depends(get_db), _: User = Depends(require_permission("blog:write"))
):
    p = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    old_slug = p.slug
    updates = data.model_dump(exclude_unset=True)
    if updates.get("is_published") and not p.published_at:
        p.published_at = datetime.now(timezone.utc)
    for k, v in updates.items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    blog_service.invalidate_blog_cache(old_slug)
    blog_service.invalidate_blog_cache(p.slug)
    return BlogPostOut.model_validate(p)


@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), _: User = Depends(require_permission("blog:write"))):
    p = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    slug = p.slug
    db.delete(p)
    db.commit()
    blog_service.invalidate_blog_cache(slug)
    return {"ok": True}
