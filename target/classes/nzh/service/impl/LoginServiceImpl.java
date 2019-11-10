package nzh.service.impl;

import nzh.service.base.BaseDataServiceImpl;
import org.springframework.stereotype.Service;
import nzh.service.LoginService;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl extends BaseDataServiceImpl implements LoginService {

    @Override
    public Object login(String username, String password) {
        Map<String,String> map=new HashMap<String,String>();
        map.put("username",username);
        map.put("password",password);
        return getBaseDao().queryForObject("loginMapper.login",map);
    }
}
