const population = 1000;
const step1ChanceAOverB = 0.5;
const step2ChanceAOverB = 0.5;
const chanceToPassThroughStep1A = 0.9;
const chanceToPassThroughStep1B = 0.2;

const choose = (chance: number) => Math.random() < chance;

const people = Array(population)
  .fill(null)
  .map(() => [
    choose(step1ChanceAOverB) ? "A" : "B", // Step 1
    choose(step2ChanceAOverB) ? "A" : "B", // Step 2
  ]);

console.log("Initial split");
console.log({
  step1: {
    A: people.filter((p) => p[0] === "A").length,
    B: people.filter((p) => p[0] === "B").length,
  },
  step2: {
    A: people.filter((p) => p[1] === "A").length,
    B: people.filter((p) => p[1] === "B").length,
  },
});

// Step 1
const droppedOnStep1: typeof people = [];
const goesToStep2: typeof people = [];
for (const person of people) {
  if (person[0] === "A") {
    // Variant A
    if (choose(chanceToPassThroughStep1A)) {
      goesToStep2.push(person);
    } else {
      droppedOnStep1.push(person);
    }
  } else {
    // Variant B
    if (choose(chanceToPassThroughStep1B)) {
      goesToStep2.push(person);
    } else {
      droppedOnStep1.push(person);
    }
  }
}

console.log();
console.log("After step 1");
console.log("Went through step 1");
console.log({
  step1: {
    A: goesToStep2.filter((p) => p[0] === "A").length,
    B: goesToStep2.filter((p) => p[0] === "B").length,
  },
  step2: {
    A: goesToStep2.filter((p) => p[1] === "A").length,
    B: goesToStep2.filter((p) => p[1] === "B").length,
  },
});

console.log();
console.log("Dropped on step 1");
console.log({
  step1: {
    A: droppedOnStep1.filter((p) => p[0] === "A").length,
    B: droppedOnStep1.filter((p) => p[0] === "B").length,
  },
  step2: {
    A: droppedOnStep1.filter((p) => p[1] === "A").length,
    B: droppedOnStep1.filter((p) => p[1] === "B").length,
  },
});
