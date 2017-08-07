# Congress

This node application displays the current sitting U.S. Senators for all states. It allows viewing them as a list, individually on a detail page, as well as deletion and addition of Senator records.

## Tasks for Homework

* Convert this project to use Mongoose.
  * Add it as a dependency
  * Create a schema for a Senator record
  * Use Mongoose and the schema to perform validation on new records that are added.
  
 ## Tips for setup
 
* Clone this repo
* At the terminal, run the following to import the Senator data into Mongo:
    `mongoimport --db senatorsdb --collection senators --type json --file senators.json --jsonArray`
* Before you get to coding, take a look around the project to familiarize yourself with the code.
* Much of this code is messy and there is some duplication of functionality. As you refactor it, see where you can consolidate the functionality and stick to the DRY principle.
* To get this into a repo of your own, once you clone it down from GitHub, simply copy the folder into a separate location (like wherever you keep your homework projects), delete the `.git` folder in the project, and run `git init` to create a new repo.
