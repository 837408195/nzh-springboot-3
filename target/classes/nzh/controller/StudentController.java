package nzh.controller;

import nzh.entity.StudentEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import nzh.service.StudentService;

@Controller
public class StudentController {
    @Autowired
    private StudentService studentService;
    @RequestMapping("/listStudent")
    public String listStudent(Model model) {
        model.addAttribute("students", studentService.listStudent());
        return "student/list";
    }

    @RequestMapping("/deleteStudent")
    public String deleteStudent(Integer id) {
        studentService.deleteStudent(id);
        return "redirect:/listStudent";
    }

    @RequestMapping("/toAdd")
    public String toAdd(){
        return "student/add";
    }
    @RequestMapping("/insertStudent")
    public String insertStudent(StudentEntity studentEntity) {
        studentService.insertStudent(studentEntity);
        return "redirect:/listStudent";
    }

    @RequestMapping("/toEdit")
    public String toEdit(Model model, Integer id){
        model.addAttribute("student",studentService.findStudentById(id));
        return "student/edit";
    }
    @RequestMapping("/updateStudent")
    public String updateStudent(StudentEntity studentEntity){
        studentService.updateStudent(studentEntity);
        return "redirect:/listStudent";
    }


}
