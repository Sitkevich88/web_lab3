package managedBeans;

import other.DatabaseConnection;
import other.MyPoint;
import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import java.sql.*;
import java.util.ArrayList;

@SuppressWarnings("ALL")
@ManagedBean(name="databaseBean", eager = true)
@ApplicationScoped
public class DatabaseBean {

    private Connection getConnection() throws ClassNotFoundException, SQLException {
        return DatabaseConnection.getConnection();
    }

    public ArrayList<MyPoint> select() throws ClassNotFoundException, SQLException {
        ArrayList<MyPoint> records = new ArrayList<>();
        Connection con = getConnection();
        if (con==null){
            return records;
        }
        ResultSet rs = null;
        PreparedStatement pst = null;
        String stm = "Select * from points ORDER BY POINT_ID ASC";

        try {
            pst = con.prepareStatement(stm);
            pst.execute();
            rs = pst.getResultSet();

            while(rs.next()) {
                MyPoint point = new MyPoint();
                if (rs.rowDeleted()){continue;}
                point.setId(rs.getInt(1));
                point.setX(rs.getDouble(2));
                point.setY(rs.getDouble(3));
                point.setR(rs.getInt(4));
                point.setRes(rs.getString(5));
                records.add(point);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if(rs!=null){ rs.close();};
            if(pst!=null){ pst.close();}
        }
        return records;
    }
}
