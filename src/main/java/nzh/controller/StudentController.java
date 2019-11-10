package nzh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import nzh.service.StudentService;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/student")
public class StudentController{
    @Autowired
    private StudentService studentService;

    @RequestMapping("/toList")
    public String toListStudent(){
        return "student/list";
    }

    @RequestMapping("/list")
    @ResponseBody
    public List<Map<String,String>> listStudent() {
        List<Map<String,String>> list = studentService.listStudent();
        return list;
    }

    @RequestMapping("/delete")
    public String deleteStudent(Integer id) {
        studentService.deleteStudent(id);
        return toListStudent();
    }

    @RequestMapping("/toAdd")
    public String toAdd(){
        return "student/add";
    }

    @RequestMapping("/insert")
    public String insertStudent(@RequestParam Map<String, String> map){
        studentService.insertStudent(map);
        return toListStudent();
    }

    @RequestMapping("/toEdit")
    public String toEdit(Model model, Integer id){
        model.addAttribute("student",studentService.findStudentById(id));
        return "student/edit";
    }
    @RequestMapping("/update")
    public String updateStudent(@RequestParam Map<String, String> map){
        studentService.updateStudent(map);
        return toListStudent();
    }


}
