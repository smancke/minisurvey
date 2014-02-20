minisurvey
==========

Simple survey solution, written mostly in JavaScript and some PHP.

This is a very simple tool to aggregate information e.g. from surveys.
My usecase was to review software quality in teams, but it would be very 
simple to adopt it to other usecases. You only have to edit the questionData.json file.


The tool is implemented absolutely simple: It stores the data on the filesystem and has no security.
So you should only run it behind an .htaccess in the intranet and not for sensitive data.