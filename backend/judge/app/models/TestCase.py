import uuid

from sqlmodel import Field, SQLModel


class TestCase(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    name: str = Field(max_length=50)
    problem_id: int = Field(foreign_key="problem.id", index=True)
    input_file: str = Field(max_length=500)  # /data/problems/1/testcases/01.in
    output_file: str = Field(max_length=500)  # /data/problems/1/testcases/01.out
    # TODO: add points for each test case and order for execution
