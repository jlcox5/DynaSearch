import java.awt.*;
import java.awt.event.*;
import java.applet.*;

import netscape.javascript.*;
import netscape.javascript.JSObject;

interface spyHandler{
   public void Handle(AWTEvent e);
   public void setApplet(Applet napp);
}

class nullHandler implements spyHandler{
   public void Handle(AWTEvent e){
   }
   public void setApplet(Applet napp){
   }
}

class spyMouse implements spyHandler{
   public void Handle(AWTEvent e){
      MouseEvent me = (MouseEvent)e;
      JSObject.getWindow(app).eval("alert('[Mouse Spy]: You've been struck by a smooth criminal');");
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}
class spyKeys implements spyHandler{
   public void Handle(AWTEvent e){
      KeyEvent ke = (KeyEvent)e;
      JSObject.getWindow(app).eval("alert('[Key Spy]: You've been struck by a smooth criminal');");
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}
class spyAction implements spyHandler{
   public void Handle(AWTEvent e){
      ActionEvent ae = (ActionEvent)e;
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}

class testSpy implements spyHandler{
   public void Handle(AWTEvent e){
      JSObject.getWindow(app).eval("alert('testing... 1,2,3.');");
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}
public class eventSpy_ctorhook{

   public class spyEventQueue extends java.awt.EventQueue {
      public spyHandler Mouse;
      public spyHandler Keys;
      public spyHandler Action;
      public spyEventQueue(spyHandler mouse
                          , spyHandler keys
                          , spyHandler action){
         super();
         Mouse  = mouse;
         Keys   = keys;
         Action = action;
      }
      public void dispatchEvent(java.awt.AWTEvent evt){
         if(evt instanceof MouseEvent){
            Mouse.Handle(evt);
         }else if (evt instanceof KeyEvent){
            Keys.Handle(evt);
         }else if (evt instanceof ActionEvent){
            Action.Handle(evt);
         }
         super.dispatchEvent(evt);
      }
   }

   public eventSpy_ctorhook(String appname){
      Toolkit tk = java.awt.Toolkit.getDefaultToolkit();
      tk.getSystemEventQueue().push(mkSpyEQ(appname));
   }

   public spyEventQueue mkSpyEQ(String appname){
      spyHandler m = new spyMouse();
      spyHandler k = new spyKeys();
      spyHandler a = new spyAction();

      Applet app = (new Applet()).getAppletContext().getApplet(appname);
      JSObject.getWindow(app).eval("alert('Called mkSpyEQ with argument: " + appname + "');");

      m.setApplet(app);
      k.setApplet(app);
      a.setApplet(app);
      return new spyEventQueue(m,k,a);
   }
}
