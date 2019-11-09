package nzh.service;

import nzh.entity.LoginEntity;

public interface LoginService {
    LoginEntity login(String username, String password);
}
