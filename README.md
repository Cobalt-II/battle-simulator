# battle-simulator
a basic 2d ctx battle simulator.

To install, simply download the files and run ```npm install express```. Then run ```node app``` to start the program.

1/9/23 (release):

This is a basic battle simulator where two teams fight. the player can place down "units" via mouseclick. To toggle the current unit, press the up or down arrow. To change the team sides, press p. To start or stop the battle, simply press enter when you are ready, and watch the magic happen. The code is pretty simple to edit if you want to make your own units too. A base example of given abilities, death events, and movement types are all laid out for you.

In this base version, there are 4 units (base, healer, infect, garg), 1 movement type (norm), 1 active ability (healing), and 2 death events (base, infect). Anyone who wishes can pretty easily add more however.

![download](https://user-images.githubusercontent.com/97923189/211421062-736f0d3d-862b-4ecd-a12e-5e8975bcd5b9.png)

2/20/23:
Added the summoner unit, will summon a base unit every second. Additionally, because of this change, the new summon ability has been added.

2/20/23 (patch): 
Fixed the summoner unit not spawning entities after a battle pause and continue.

2/20/23 (part 2):
Added a deletion mechanic. You can delete units when in placement mode by using right mouse button on them.

2/25/23:
Completely reworked interval mechanics (got rid of ids, etc. as not needed anymore). Fixed the summoner unit passing its ability off.

3/8/23: 
Reworked the movement mechanics so that it's easier to make new ones. You can now acquire entities and their distances from a certain entity by using the getEnts() function, making custom verisons of this easier to work with for movement.

4/1/23:
Huge update. Added more functions for easier use. New unit called Ranger that shoots projectiles at enemies. Two new abilities: shoot (ranger shoot ability) and timedLife (bullets die after x amount of time). 2 new movement types: angle (for bullets moving at a specific angle), and ranger (rangers will back up at a certain amount of range away from their target). Healers now move towards their own teammates. 

4/2/23: 
Added an entity tick system rather than using Date.now() timing for better sync. Added an entity counter. Rebalanced ranger and its bullet. Added the commando and its "roll" ability.

