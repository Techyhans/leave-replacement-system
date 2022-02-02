from fastapi import APIRouter

from app.api.endpoints import login, users, subjects, rosters, leaves, models, replacements

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(rosters.router, prefix="/rosters", tags=["rosters"])
api_router.include_router(leaves.router, prefix="/leaves", tags=['leaves'])
api_router.include_router(models.router, prefix="/models", tags=['models'])
api_router.include_router(replacements.router, prefix="/replacements", tags=['replacements'])
