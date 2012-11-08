To Install the DynaSearch Software:

1. Copy the DynaSearch folder to the appropriate folder utilized by the webserver.

2. Go the the file Dynasearch/assets/php/config.php and provide the appropriate information for the following:
   $DB_HOST - this is the host name where the database is located
   $DB_USER - this is the user account that will be able to log in, querry, and make changes to the emdss database
   $DB_PASS - this is the password for $DB_USER account
   ** Note - Do not change the database name unless the name is also changed on the database server

3. Import the emdss database into the MySQL server.  The database file is named EMDSS_DB.sql.zip and can 
   be found in the Dynaview diretory.

4. To test whether the system was imported correctly, go to *webaddress*/Dynasearch/login.php with the user name
   jlcox5 with the password jlcox5.  It should take you to a testing page.

If there are any problems or questions, please contact:

Jonathan Cox
jlcox@g.clemson.edu
Clemson Unviersity
864-567-3265