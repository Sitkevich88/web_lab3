package other;

public class MyPoint {

    int id;
    double x;
    double y;
    int r;
    String res;

    public MyPoint(int id, double x, double y, int r, String res) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.res = res;
    }

    public MyPoint(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public int getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }

    public String getRes() {
        return res;
    }

    public void setRes(String res) {
        this.res = res;
    }
}
