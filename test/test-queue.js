const queue = require('../lib/queue');
const assert = require('assert');

describe('Queue',
    function () {
        describe('#search()',
            function () {
                it(
                    'should run a task',
                    function () {
                        let taskQueue = queue.create();
                        let isTaskRun = false;
                        taskQueue.add(() => {
                            isTaskRun = true
                        });
                        taskQueue.run();
                        assert(isTaskRun, 'The task has not run.');
                    }
                );
                it(
                    'should switch delay ranges if falsely specified',
                    function () {
                        let taskQueue = queue.create();

                        assert.equal(taskQueue.getMinDelay(), 0, 'The initial value should be 0');
                        assert.equal(taskQueue.getMaxDelay(), 0, 'The initial value should be 0');

                        taskQueue.setMinDelay(100);
                        taskQueue.setMaxDelay(200);

                        assert.equal(taskQueue.getMinDelay(), 100, 'The new value should be stored');
                        assert.equal(taskQueue.getMaxDelay(), 200, 'The new value should be stored');

                        taskQueue.setMinDelay(201);
                        taskQueue.setMaxDelay(101);

                        assert.equal(taskQueue.getMinDelay(), 101, 'The new value should be switched');
                        assert.equal(taskQueue.getMaxDelay(), 201, 'The new value should be switched');

                        taskQueue.setMinDelay(-2);
                        taskQueue.setMaxDelay(-3);

                        assert.equal(taskQueue.getMinDelay(), 101, 'The value change is ignored with negative values.');
                        assert.equal(taskQueue.getMaxDelay(), 201, 'The value change is ignored with negative values.');
                    }
                );

                it(
                    'should run a task with delay',
                    function () {
                        let taskQueue = queue.create();
                        let isTaskRun = false;
                        taskQueue.add(() => {
                            isTaskRun = true
                        });
                        taskQueue.setMinDelay(100);
                        taskQueue.setMaxDelay(200);
                        taskQueue.run();
                        assert(!isTaskRun, 'The task must not yet have run.');
                        setTimeout(function () {
                            assert(isTaskRun, 'The task has not run.');
                        }, 250);
                    }
                );

                it(
                    'should run a tasks within delay limits',
                    function () {
                        let taskQueue = queue.create();
                        let numTasksRun = 0;
                        const numTasksToRun = 15;
                        let startTime = new Date().getTime();

                        function verify() {
                            let timePassed = new Date().getTime() - startTime;
                            startTime = new Date().getTime();
                            assert(timePassed >= 50, 'The task was started too early.');
                            assert(timePassed <= 90, 'The task was started too late.');
                            numTasksRun++;
                        }

                        for (let i = 0; i < numTasksToRun; i++) {
                            taskQueue.add(verify);
                        }
                        taskQueue.setMinDelay(50);
                        taskQueue.setMaxDelay(90);
                        taskQueue.run();

                        setTimeout(function () {
                            assert.equal(numTasksRun, numTasksToRun, 'Not all tasks have run');
                        }, 500);
                    }
                );
            }
        );
    }
);