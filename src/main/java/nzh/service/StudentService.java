package nzh.service;

import nzh.entity.StudentEntity;

import java.util.List;

public interface StudentService {
    List<StudentEntity> listStudent();
    StudentEntity findStudentById(Integer id);
    void insertStudent(StudentEntity StudentEntity);
    void updateStudent(StudentEntity StudentEntity);
    void deleteStudent(Integer id);
}
