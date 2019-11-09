package nzh.service.impl;

import nzh.dao.LoginDao;
import nzh.entity.LoginEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import nzh.service.LoginService;
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private LoginDao loginDao;
    @Override
    public LoginEntity login(String username, String password) {
        return loginDao.login(username,password);
    }
}
