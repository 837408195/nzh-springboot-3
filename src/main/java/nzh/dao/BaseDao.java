package nzh.dao;

import java.util.List;
import java.util.Map;

public interface BaseDao {

    /**
     * 查询列表
     *
     * @param sqlId
     *            脚本编号
     * @param params
     *            参数
     * @return 列表
     */
    public List<Map<String, String>> queryForList(String sqlId,
                                                  Map<String, String> param);
    public int delete(String sqlId, Map<String, String> map);
    public int delete(String sqlId, int id);
    /**
     * 修改数据
     *
     * @param sqlId
     *            脚本编号
     * @param object
     *            对象
     * @return 修改的行数
     */
    public int update(String sqlId, Object object);
    public Object queryForObject(String sqlId, int id);
    public Object queryForObject(String sqlId, Object object);
    public int insert(String sqlId, Object object);


}
