package nzh.dao;

import nzh.entity.LoginEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginDao {
    LoginEntity login(String username,String password);
}
