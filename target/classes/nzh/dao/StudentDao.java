package nzh.dao;

import nzh.entity.StudentEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface StudentDao {
    List<StudentEntity> listStudent();
    StudentEntity findStudentById(Integer id);
    void insertStudent(StudentEntity StudentEntity);
    void updateStudent(StudentEntity StudentEntity);
    void deleteStudent(Integer id);
}
