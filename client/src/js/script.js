// Optimize global variables by encapsulating them in an object
const CalorieTracker = {
  totalCalories: 0,
  calorieGoal: 2000,
  userProfile: {
      pregnancyWeek: null,
      prePregnancyWeight: null,
      currentWeight: null,
      height: null,
      activityLevel: null,
      dietaryRestrictions: [],
      medicalConditions: [], // gestational diabetes, preeclampsia, etc.
      trimester: null
  },

  // Function to update the dashboard
  updateDashboard: function() {
      document.getElementById('total-calories').innerText = this.totalCalories;
      const progress = (this.totalCalories / this.calorieGoal) * 100;
      document.querySelector('.progress').style.width = progress + '%';
      document.getElementById('calories-progress').innerText = this.totalCalories;
  },

  // Function to add food entry
  addFoodEntry: function(calories) {
      this.totalCalories += calories;
      this.updateDashboard();
      // Add to recent entries
      const recentEntries = document.getElementById('recent-entries');
      const li = document.createElement('li');
      li.innerText = `Added ${calories} calories`;
      recentEntries.appendChild(li);
  },

  // Load saved data from localStorage
  loadSavedData: function() {
      const saved = localStorage.getItem('dailyCalories');
      if (saved) {
          const savedData = JSON.parse(saved);
          // Only load today's data
          if (savedData.date === new Date().toDateString()) {
              this.dailyCalories = savedData;
              this.updateDisplay();
              this.updateFoodLog();
          } else {
              // Reset for new day
              this.resetDailyData();
          }
      }
  },

  // Reset daily tracking
  resetDailyData: function() {
      this.dailyCalories = {
          consumed: 0,
          target: this.calorieGoal,
          meals: [],
          date: new Date().toDateString(),
      };
      this.saveData();
      this.updateDisplay();
      this.updateFoodLog();
  },

  // Save data to localStorage
  saveData: function() {
      this.dailyCalories.date = new Date().toDateString();
      localStorage.setItem('dailyCalories', JSON.stringify(this.dailyCalories));
  },

  // Update the display with current calorie counts
  updateDisplay: function() {
      document.getElementById('calorieTarget').textContent = this.dailyCalories.target;
      document.getElementById('caloriesConsumed').textContent = this.dailyCalories.consumed;
      document.getElementById('caloriesRemaining').textContent = Math.max(0, this.dailyCalories.target - this.dailyCalories.consumed);
  },

  // Update the food log display
  updateFoodLog: function() {
      const foodLog = document.getElementById('foodLog');
      foodLog.innerHTML = '';
      if (this.dailyCalories.meals.length === 0) {
          foodLog.innerHTML = '<p>No meals logged today</p>';
          return;
      }
      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.padding = '0';
      this.dailyCalories.meals.forEach((meal, index) => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.justifyContent = 'space-between';
          li.style.alignItems = 'center';
          li.style.marginBottom = '8px';
          li.style.padding = '8px';
          li.style.backgroundColor = '#fff';
          li.style.borderRadius = '4px';
          li.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          const mealInfo = document.createElement('span');
          const time = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          mealInfo.textContent = `${time} - ${meal.type}: ${meal.calories} calories`;
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '×';
          deleteBtn.style.backgroundColor = '#ff4444';
          deleteBtn.style.color = 'white';
          deleteBtn.style.border = 'none';
          deleteBtn.style.borderRadius = '50%';
          deleteBtn.style.width = '24px';
          deleteBtn.style.height = '24px';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.style.display = 'flex';
          deleteBtn.style.justifyContent = 'center';
          deleteBtn.style.alignItems = 'center';
          deleteBtn.onclick = () => this.deleteMeal(index);
          li.appendChild(mealInfo);
          li.appendChild(deleteBtn);
          list.appendChild(li);
      });
      foodLog.appendChild(list);
  },

  // Delete a meal from the log
  deleteMeal: function(index) {
      this.dailyCalories.consumed -= this.dailyCalories.meals[index].calories;
      this.dailyCalories.meals.splice(index, 1);
      this.saveData();
      this.updateDisplay();
      this.updateFoodLog();
  },

  // Add calories to the daily total
  addCalories: function() {
      const calorieInput = document.getElementById('calorieInput');
      const mealType = document.getElementById('mealType');
      const calories = parseInt(calorieInput.value);
      if (isNaN(calories) || calories <= 0) {
          console.error('Invalid input: Please enter a valid number of calories');
          return;
      }
      this.dailyCalories.consumed += calories;
      this.dailyCalories.meals.push({
          type: mealType.value === 'meal' ? 'Main Meal' : 'Snack',
          calories: calories,
          timestamp: new Date().toISOString(),
      });
      this.saveData();
      this.updateDisplay();
      this.updateFoodLog();
      calorieInput.value = '';
  },

  // Load saved data from localStorage
  loadSavedData: function() {
      const saved = localStorage.getItem('dailyCalories');
      if (saved) {
          const savedData = JSON.parse(saved);
          if (savedData.date === new Date().toDateString()) {
              this.dailyCalories = savedData;
              this.updateDisplay();
              this.updateFoodLog();
          } else {
              this.resetDailyData();
          }
      }
  },

  // Reset daily tracking
  resetDailyData: function() {
      this.dailyCalories = {
          consumed: 0,
          target: this.calorieGoal,
          meals: [],
          date: new Date().toDateString(),
      };
      this.saveData();
      this.updateDisplay();
      this.updateFoodLog();
  },

  // Save data to localStorage
  saveData: function() {
      this.dailyCalories.date = new Date().toDateString();
      localStorage.setItem('dailyCalories', JSON.stringify(this.dailyCalories));
  },

  // Update the display with current calorie counts
  updateDisplay: function() {
      document.getElementById('calorieTarget').textContent = this.dailyCalories.target;
      document.getElementById('caloriesConsumed').textContent = this.dailyCalories.consumed;
      document.getElementById('caloriesRemaining').textContent = Math.max(0, this.dailyCalories.target - this.dailyCalories.consumed);
  },

  calculateRecommendedCalories() {
    // Trimester-specific calorie calculations
    const baseCalories = this.calculateBMR();
    const trimesterAdjustment = {
      1: 0,        // First trimester: +0 calories
      2: 340,      // Second trimester: +340 calories
      3: 450       // Third trimester: +450 calories
    };
    return baseCalories + trimesterAdjustment[this.userProfile.trimester];
  },

  calculateBMR() {
    // Basal Metabolic Rate calculation using Harris-Benedict equation
    // Adjusted for pregnancy
  }
};

// Initialize the application
window.onload = function () {
  CalorieTracker.loadSavedData();
  initializeProfile();
};