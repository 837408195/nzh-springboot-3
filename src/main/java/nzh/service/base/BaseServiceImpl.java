package nzh.service.base;

import nzh.dao.impl.BaseDaoImpl;
import org.springframework.beans.factory.annotation.Autowired;

public class BaseServiceImpl {
    @Autowired
    private BaseDaoImpl baseDao;

    public BaseDaoImpl getBaseDao() {
        return baseDao;
    }
}
