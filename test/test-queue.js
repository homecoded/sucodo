/*jshint esversion: 6 */
"use strict";

const queue = require("../js/lib/queue");
const assert = require("assert");

describe("Queue",
    function () {
        describe("#Queue()",
            function () {
                it(
                    "should run a task",
                    function () {
                        let taskQueue = queue.create();
                        let isTaskRun = false;
                        taskQueue.add(() => {
                            isTaskRun = true;
                        });
                        taskQueue.run();
                        assert(isTaskRun, "The task has not run.");
                    }
                );
                it(
                    "should switch delay ranges if falsely specified",
                    function () {
                        let taskQueue = queue.create();

                        assert.equal(taskQueue.getMinDelay(), 0, "The initial value should be 0");
                        assert.equal(taskQueue.getMaxDelay(), 0, "The initial value should be 0");

                        taskQueue.setMinDelay(100);
                        taskQueue.setMaxDelay(200);

                        assert.equal(taskQueue.getMinDelay(), 100, "The new value should be stored");
                        assert.equal(taskQueue.getMaxDelay(), 200, "The new value should be stored");

                        taskQueue.setMinDelay(201);
                        taskQueue.setMaxDelay(101);

                        assert.equal(taskQueue.getMinDelay(), 101, "The new value should be switched");
                        assert.equal(taskQueue.getMaxDelay(), 201, "The new value should be switched");

                        taskQueue.setMinDelay(-2);
                        taskQueue.setMaxDelay(-3);

                        assert.equal(taskQueue.getMinDelay(), 101, "The value change is ignored with negative values.");
                        assert.equal(taskQueue.getMaxDelay(), 201, "The value change is ignored with negative values.");
                    }
                );

                it(
                    "should run a task with delay",
                    function (done) {
                        let taskQueue = queue.create();
                        let isTaskRun = false;
                        taskQueue.add(() => {
                        });
                        taskQueue.add(() => {
                            isTaskRun = true;
                        });
                        taskQueue.setMinDelay(100);
                        taskQueue.setMaxDelay(200);
                        taskQueue.run();
                        assert(!isTaskRun, "The task must not yet have run.");
                        setTimeout(function () {
                            assert(isTaskRun, "The task has not run.");
                            done();
                        }, 250);
                    }
                );

                it(
                    "should run a tasks within delay limits",
                    function (done) {
                        this.timeout(5000);
                        let taskQueue = queue.create();
                        let numTasksRun = 0;
                        const numTasksToRun = 50;
                        const minDelay = 20;
                        const maxDelay = 90;
                        const timeInaccuracyRange = 5; // allow 5 milliseconds of leeway for timing
                        let startTime = new Date().getTime();

                        function verify() {
                            let timePassed = new Date().getTime() - startTime;
                            startTime = new Date().getTime();
                            assert(
                                timePassed >= minDelay - timeInaccuracyRange,
                                "The task was started too early. " + timePassed
                            );
                            assert(
                                timePassed <= maxDelay + timeInaccuracyRange,
                                "The task was started too late. " + timePassed
                            );
                            numTasksRun++;
                        }

                        taskQueue.add(() => {
                        }); // first task get executed immediately, so add a blank one
                        for (let i = 0; i < numTasksToRun; i++) {
                            taskQueue.add(verify);
                        }
                        taskQueue.setMinDelay(minDelay);
                        taskQueue.setMaxDelay(maxDelay);
                        taskQueue.run();

                        setTimeout(function () {
                            assert.equal(numTasksRun, numTasksToRun, "Not all tasks have run");
                            done();
                        }, maxDelay * numTasksToRun + timeInaccuracyRange);
                    }
                );

                it(
                    "should not start a queue twice",
                    function () {
                        let taskQueue = queue.create();
                        let numTasks = 0;

                        taskQueue.add(
                            function () {
                                assert.equal(numTasks, 0, "The task has run already.");
                                numTasks++;
                            }
                        );
                        taskQueue.setMinDelay(50);
                        taskQueue.setMaxDelay(90);
                        assert(taskQueue.run(), "The queue could not be started");
                        assert(!taskQueue.run(), "The queue should not be able to start twice.");

                        setTimeout(function () {
                            assert.equal(numTasks, 1, "Number of runs do not match.");
                        }, 120);
                    }
                );
            }
        );
    }
);