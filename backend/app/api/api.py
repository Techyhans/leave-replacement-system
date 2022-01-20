from fastapi import APIRouter

from app.api.endpoints import login, users, subjects, rosters

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(rosters.router, prefix="/roster", tags=["rosters"])
