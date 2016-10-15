
import aiml
import marshal
import os

# Create the kernel and learn AIML files
kernel = aiml.Kernel()

# If brain exists, load it, else, create it
if os.path.isfile("bot_brain.brn"):
    kernel.bootstrap(brainFile="bot_brain.brn")
else:
    kernel.bootstrap(learnFiles="std-startup.xml", commands="load aiml b")
    kernel.saveBrain("bot_brain.brn")

session = ""
# Press CTRL-C to break this loop
while True:
    name = raw_input(kernel.respond("hello"))

    if os.path.isfile(name + ".ses"):

        session = kernel.getSessionData(name)
        kernel.setPredicate("name", session["name"], name)
        kernel.setPredicate("age", session["age"], name)
        kernel.setPredicate("occupation", session["occupation"], name)

        print (kernel.respond("sayhi", name))
    else:
        kernel.setPredicate("name", name, name)
        # age = raw_input("Ok, " + name + ", what is your age?\n")
        age = raw_input(kernel.respond("askage"))
        kernel.setPredicate("age", age, name)
        occupation = raw_input(kernel.respond("askocc"))
        kernel.setPredicate("occupation", occupation, name)

    # session = kernel.getSessionData(name)
    sessionFile = file(name + ".ses", "w")
    marshal.dump(session, sessionFile)
    sessionFile.close()

    while True:
        input = raw_input(">> ")
        if input == "exit":
            break
        response = kernel.respond(input)
        print (response)

    # session = kernel.getSessionData(name)
    # sessionFile = file(name + ".ses", "wb")
    # marshal.dump(session, sessionFile)
    # exit()
