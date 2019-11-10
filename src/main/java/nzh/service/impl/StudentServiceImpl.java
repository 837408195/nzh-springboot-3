package nzh.service.impl;

import nzh.service.base.BaseDataServiceImpl;
import org.springframework.stereotype.Service;
import nzh.service.StudentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentServiceImpl extends BaseDataServiceImpl implements StudentService {
    @Override
    public List<Map<String, String>> listStudent() {
        Map<String, String> inParams = new HashMap<String, String>();
        List<Map<String, String>> list = getBaseDao().queryForList("studentMapper.listStudent", inParams);
        System.out.println(list);
        return list;
    }

    @Override
    public Object findStudentById(Integer id) {
        return getBaseDao().queryForObject("studentMapper.findStudentById",id);
    }

    @Override
    public void insertStudent(Map<String, String> inParams) {
        getBaseDao().insert("studentMapper.insertStudent",inParams);
    }

    @Override
    public void updateStudent(Map<String, String> inParams) {
        getBaseDao().update("studentMapper.updateStudent", inParams);
    }

    @Override
    public void deleteStudent(Integer id) {
        getBaseDao().delete("studentMapper.deleteStudent", id);
    }
}
