import logging
import json
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.dataset import DatasetRead, DatasetCreate
from app.db.schema import Dataset
#from app.exceptions.user import UserNotFoundError, InvalidPasswordError, PasswordMismatchError


class DatasetService:

    def __init__(self, session: AsyncSession) -> None:
        self._db = session

    async def create_dataset(self, user_id, form, upload_file):
        
        # Normalize tags
        parsed_tags: Optional[List[str]] = None
        if form.tags:
            try:
                parsed = json.loads(form.tags)
                if isinstance(parsed, list):
                    parsed_tags = [str(t) for t in parsed]
                else:
                    parsed_tags = [t.strip() for t in str(tags).split(",") if t.strip()]
            except Exception:
                parsed_tags = [t.strip() for t in str(tags).split(",") if t.strip()]

        # Normalizar category_ids
        parsed_cat_ids: Optional[List[int]] = None
        if form.category_ids:
            try:
                parsed = json.loads(form.category_ids)
                if isinstance(parsed, list):
                    parsed_cat_ids = [int(x) for x in parsed]
                else:
                    parsed_cat_ids = [int(x) for x in str(category_ids).split(",") if x.strip()]
            except Exception:
                parsed_cat_ids = [int(x) for x in str(category_ids).split(",") if x.strip()]

        # Construir DTO validado
        try:
            dto = Dataset(
                title=title,
                description=description,
                tags=parsed_tags,
                category_ids=parsed_cat_ids,
                file_type=file_type,
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Validar extensión/content-type opcionalmente
        if file_type == FileType.csv and not file.content_type in ("text/csv","application/vnd.ms-excel"):
            # puedes hacer validaciones más estrictas
            pass

        # Lógica para almacenar/parsear el archivo (ej: subir a storage, extraer metadatos)
        contents = await file.read()
        # aquí delegas a un servicio que guarde el archivo y cree el dataset
        created = await DatasetService(db).create_dataset(dto, file.filename, contents)

        return created
        