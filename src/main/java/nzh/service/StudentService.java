package nzh.service;

import java.util.List;
import java.util.Map;

public interface StudentService {
    List<Map<String, String>> listStudent();
    Object findStudentById(Integer id);
    void insertStudent(Map<String, String> map);
    void updateStudent(Map<String, String> map);
    void deleteStudent(Integer id);
}
