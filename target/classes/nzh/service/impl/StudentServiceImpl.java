package nzh.service.impl;

import nzh.dao.StudentDao;
import nzh.entity.StudentEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import nzh.service.StudentService;

import java.util.List;
@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentDao studentDao;
    @Override
    public List<StudentEntity> listStudent() {
        return studentDao.listStudent();
    }

    @Override
    public StudentEntity findStudentById(Integer id) {
        return studentDao.findStudentById(id);
    }

    @Override
    public void insertStudent(StudentEntity StudentEntity) {
        studentDao.insertStudent(StudentEntity);
    }

    @Override
    public void updateStudent(StudentEntity StudentEntity) {
        studentDao.updateStudent(StudentEntity);
    }

    @Override
    public void deleteStudent(Integer id) {
        studentDao.deleteStudent(id);
    }
}
