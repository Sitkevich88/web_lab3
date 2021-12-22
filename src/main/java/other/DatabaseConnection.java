package other;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static Connection con;

    static {
        try {
            Class.forName("oracle.jdbc.OracleDriver");
            con = DriverManager.getConnection( "jdbc:oracle:thin:@localhost:1521:orbis","s312693","uuh591");
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection(){
        return con;
    }

}
