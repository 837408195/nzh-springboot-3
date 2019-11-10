package nzh.dao.impl;

import com.ai.frame.util.ConvertUtil;
import nzh.dao.BaseDao;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
@Service
public class BaseDaoImpl implements BaseDao {
    @Autowired
    private SqlSession sqlSession;

    public SqlSession getSqlSession() {
        return sqlSession;
    }

    @Override
    public List<Map<String, String>> queryForList(String sqlId,
                                                  Map<String, String> param) {
        List<Map<String, Object>> list = getSqlSession().selectList(sqlId, param);
        List<Map<String, String>> beans = ConvertUtil.convertSqlMap2JavaMap(list);
        return beans;
    }
    /**
     * 删除数据
     *
     * @param sqlId
     *            脚本编号
     * @param map
     *            待删除的对象
     * @return 主键
     */
    @Override
    public int delete(String sqlId, Map<String, String> map) {
        return getSqlSession().delete(sqlId, map);
    }
    /**
     * 删除数据
     *
     * @param sqlId
     *            脚本编号
     * @param id
     *            主键
     * @return 主键
     */
    @Override
    public int delete(String sqlId, int id) {
        return getSqlSession().delete(sqlId, id);
    }
    @Override
    public int update(String sqlId, Object object) {
        return getSqlSession().update(sqlId, object);
    }

    @Override
    public Object queryForObject(String sqlId, int id) {
        return getSqlSession().selectOne(sqlId, id);
    }

    @Override
    public Object queryForObject(String sqlId, Object object) {
        return getSqlSession().selectOne(sqlId, object);
    }

    @Override
    public int insert(String sqlId, Object object) {
        return (Integer) getSqlSession().insert(sqlId, object);
    }


}
