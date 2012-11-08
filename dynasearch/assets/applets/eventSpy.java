import java.awt.*;
import java.awt.event.*;
import java.applet.*;

import netscape.javascript.*;
import netscape.javascript.JSObject;

import java.awt.Button;
import java.lang.Thread;

interface spyHandler{
   public void HandleMouse(AWTEvent e);
   public void HandleKeys(AWTEvent e);
   public void HandleAction(AWTEvent e);
   public void setApplet(Applet napp);
   public void setAppletName(String nappname);
}

/*
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
      //JSObject.getWindow(app).eval("alert('[Mouse Spy]: Youve been struck by a smooth criminal');");

      //System.err.println("[Mouse Spy]: You've been struck by a smooth criminal");

      switch(e.getID()){
         case 501:
            System.err.println("Down");
            break;
         case 502:
            System.err.println("Up");
            break;
         case 500:
            System.err.println("Click");
            break;
      }
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}
class spyKeys implements spyHandler{
   public void Handle(AWTEvent e){
      KeyEvent ke = (KeyEvent)e;
      //JSObject.getWindow(app).eval("alert('[Key Spy]: Youve been struck by a smooth criminal');");

      //System.err.println("[Key Spy]: You've been struck by a smooth criminal");
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}
class spyAction implements spyHandler{
   public void Handle(AWTEvent e){
      ActionEvent ae = (ActionEvent)e;
      //JSObject.getWindow(app).eval("alert('[Action Spy]: Youve been struck by a smooth criminal');");

      //System.err.println("[Action Spy]: You've been struck by a smooth criminal");
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public Applet app;
}
*/

class spyAll implements spyHandler{
   private long t0;
   public void HandleMouse(AWTEvent e){
      MouseEvent me = (MouseEvent)e;
      Object src;
      switch(e.getID()){
         case 501:
            t0 = me.getWhen();
            System.err.println("[MOUSE] Down");
            src = e.getSource();
            if(src instanceof java.awt.Component){
               System.err.println("[MOUSE] --- " + ((java.awt.Component)src).getName());
            }
            break;
         case 502:
            System.err.println("[MOUSE] Up: " + (me.getWhen()-t0));
            src = e.getSource();
            if(src instanceof java.awt.Component){
               java.awt.Component csrc = (Component)src;
               System.err.println("[MOUSE] --- " + (csrc).getName());

               JSObject.getWindow(app).call("registerAppletClick",new Object[]{appname + "::" + csrc.getName(), me.getWhen()-t0, csrc.getName()});
            }
            break;
         case 500:
            System.err.println("[MOUSE] Click");
            break;
      }
   }
   public void HandleKeys(AWTEvent e){
   }
   public void HandleAction(AWTEvent e){
      System.err.println("[ACTION] " + e.getID());
      ActionEvent a = (ActionEvent)e;
      System.err.println("[ACTION] --- " + a.getActionCommand());
   }
   public void setApplet(Applet napp){
      app = napp;
   }
   public void setAppletName(String nappname){
      appname = nappname;
   }
   public Applet app;
   public String appname;
}

public class eventSpy extends Applet{

   public class spyEventQueue extends java.awt.EventQueue {
      public spyHandler handler;
      public spyEventQueue(spyHandler nhandle){
         super();
         handler = nhandle;
      }
      @Override
      protected void dispatchEvent(java.awt.AWTEvent evt){
         //System.out.println("DISPATCH");
         if(evt instanceof MouseEvent){
            handler.HandleMouse(evt);
         }else if (evt instanceof KeyEvent){
            handler.HandleKeys(evt);
         }else if (evt instanceof ActionEvent){
            handler.HandleAction(evt);
         }
         super.dispatchEvent(evt);
      }
      @Override
      public synchronized void push(java.awt.EventQueue newq){
         //System.err.println("WOT");
      }
   }

   public class propHook implements java.beans.PropertyChangeListener{
      public propHook(spyEventQueue ns){
         spy = ns;
      }
      //public Applet        app;
      public spyEventQueue spy;
      public void propertyChange(java.beans.PropertyChangeEvent evt){
         //if( evt.getPropertyName() != "gogogadgetthreadhook" ) return;

         System.err.println(spy.toString());
         java.awt.Toolkit.getDefaultToolkit().getSystemEventQueue().push(spy);
      }
   }


   public void init(){
      //JSObject.getWindow(this).eval("testing123();");
      //add(new Button("test"));
      java.lang.Thread.currentThread().setName("spyObj");
   }
   public void start(){
   }
   public void stop(){
   }
   public void destroy(){
   }
   public spyEventQueue mkSpyEQ(String appname){
      //spyHandler m = new spyMouse();
      //spyHandler k = new spyKeys();
      //spyHandler a = new spyAction();
      spyHandler handler = new spyAll();
                 handler.setAppletName(appname);

      //Applet app = getAppletContext().getApplet(appname);

      //m.setApplet(app);
      //k.setApplet(app);
      //a.setApplet(app);
      return new spyEventQueue(handler);
   }

   public class asSpyAttach extends Thread{
      public asSpyAttach(Applet originator, spyEventQueue ns, String an){
         org = originator;
         spy = ns;
         appname = an;
      }
      Applet        org;
      spyEventQueue spy;
      String        appname;
      public void run(){
         Applet app;
         while( (app = org.getAppletContext().getApplet(appname)) == null) yield();
         spy.handler.setApplet(app);

         propHook hook = new propHook(spy);
         app.addPropertyChangeListener("gogogadgetthreadhook",hook);
         while( app.getPropertyChangeListeners("gogogadgetthreadhook").length == 0 ) yield();
         System.out.println("[INFO] Activating thread hook.");
         //JSObject.getWindow(org).eval("(document.getElementsByName('"+appname+"')[0]).firePropertyChange('gogogadgetthreadhook',1748.8471,1830.0381);");

         //while((boolean)(JSObject.getWindow(org).eval("fireThreadHook('"+appname+"');")))yield();
         //JSObject.getWindow(org).call("fireThreadHook",new Object[]{(Object)appname});

         //while((boolean)(JSObject.getWindow(org).call("fireThreadHook",new Object[]{(Object)appname})))yield();
         while(firehook(appname))yield();
      }
      private JSObject getJSO(){
         JSObject ret = null;
         try{
            ret = JSObject.getWindow(org);
         }catch(JSException e){
            System.err.println("[ERROR] In getJSO()");
         }
         return ret;
      }
      private int test = 0;
      private boolean firehook(String an){
         boolean ret = false;
         try{
            boolean _ret = (boolean)getJSO().call("fireThreadHook",new Object[]{(Object)appname});
            ret = _ret;
         } catch(JSException e){
         } finally{
            return ret;
         }
         //getJSO().call("fireThreadHook",new Object[]{(Object)appname});
         //return test++ < 30;
      }
   }

   public void attachSpyTo(String appname){
      spyEventQueue spy = mkSpyEQ(appname);
      //Applet app  = getAppletContext().getApplet(appname);

      /*
      Applet app;
      while( (app = getAppletContext().getApplet(appname)) == null);

      propHook hook = new propHook(spy);
      app.addPropertyChangeListener("gogogadgetthreadhook",hook);
      */

      (new asSpyAttach(this,spy,appname)).start();

      //app.firePropertyChange("gogogadgetthreadhook",1748,1830);
   }
   public void test(){
      JSObject.getWindow(this).eval("alert('testing... 1,2,3');");
   }
   public void testThreadOwnership(){
      if( java.awt.EventQueue.isDispatchThread() )
         JSObject.getWindow(this).eval("alert('TRUE');");
      else
         JSObject.getWindow(this).eval("alert('FALSE');");
   }
}
