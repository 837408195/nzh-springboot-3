package nzh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import nzh.service.LoginService;

@Controller
public class LoginController {
    @Autowired
    private LoginService loginService;
    @RequestMapping("/")
    public String start(){
        return "login";
    }
    @RequestMapping("/login")
    public String login(String name, String password) {
        Object object = loginService.login(name, password);
        return object != null ? "index" : "login";
    }
}
