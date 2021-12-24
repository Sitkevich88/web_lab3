package managedBeans;

import other.DatabaseConnection;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.component.UIComponent;
import javax.faces.event.ActionEvent;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.sql.*;

@SuppressWarnings("ALL")
@ManagedBean(name="parameters", eager = true)
@SessionScoped
public class Parameters implements Serializable {

    @NotNull(message = "X должен быть определен")
    @DecimalMin("-2.00")
    @DecimalMax("2.00")
    private Double x;
    @NotNull(message = "Y должен быть определен")
    @DecimalMin("-5.00")
    @DecimalMax("3.00")
    private Double y;
    @NotNull(message = "R должен быть определен")
    @Min(1)
    @Max(5)
    private Integer r;
    //private volatile Integer r = 100;

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Integer getR() {
        return r;
    }

    public void setR(Integer r) {
        this.r = r;
    }

    public void toggle(ActionEvent event) {
        UIComponent component = event.getComponent();
        String rString = (String) component.getAttributes().get("value");
        Integer rInt = Integer.parseInt(rString);
        setR(rInt);
    }

    public void submit() throws ClassNotFoundException, SQLException {
        Connection con = getConnection();
        if (con==null){
            return;
        }
        PreparedStatement stmt = con.prepareStatement("insert into points(x,y,r,res) values(?,?,?,?)");
        stmt.setDouble(1, getX());
        stmt.setDouble(2, getY());
        stmt.setInt(3, getR().intValue());
        stmt.setString(4, String.valueOf(checkArea()));
        stmt.executeUpdate();
        stmt.close();
    }

    public void clear() throws ClassNotFoundException, SQLException {
        Connection con = getConnection();
        if (con==null){
            return;
        }
        Statement st = getConnection().createStatement();
        st.execute("DELETE FROM points");
        st.close();
    }

    private Connection getConnection() throws ClassNotFoundException, SQLException {
        return DatabaseConnection.getConnection();
    }

    private boolean checkArea(){
        double x;
        double y;
        int r;
        try {
            x = getX();
            y = getY();
            r = getR();
        } catch (Exception e){
            System.out.println(e.getMessage());
            return false;
        }

        if(r<0){
            return false;
        }

        if (y>=0){
            if (x>=0 && y<=(-2*x+r)){
                return true;
            } else if (x<=0 && x>=(-r) && y<=(Double.valueOf(r) / 2.0)){
                return true;
            }
        }else {
            if (x<=0 && x*x<r*r/4 && y*y<r*r/4){
                return true;
            }
        }
        return false;
    }
}
