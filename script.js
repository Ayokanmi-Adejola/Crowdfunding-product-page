// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const closeIcon = document.getElementById('closeIcon');

const backProjectBtn = document.getElementById('backProjectBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const selectRewardBtns = document.querySelectorAll('.select-reward-btn');

const pledgeModal = document.getElementById('pledgeModal');
const closePledgeModal = document.getElementById('closePledgeModal');
const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');

const pledgeOptions = document.querySelectorAll('.pledge-option');
const pledgeRadios = document.querySelectorAll('input[name="pledge"]');
const continueBtns = document.querySelectorAll('.continue-btn');

// Stats elements
const totalBacked = document.getElementById('totalBacked');
const totalBackers = document.getElementById('totalBackers');
const progressFill = document.getElementById('progressFill');

// Reward count elements
const bambooLeft = document.getElementById('bambooLeft');
const blackLeft = document.getElementById('blackLeft');
const bambooModalLeft = document.getElementById('bambooModalLeft');
const blackModalLeft = document.getElementById('blackModalLeft');

// Application state
let appState = {
  totalBackedAmount: 89914,
  totalBackersCount: 5007,
  bambooCount: 101,
  blackCount: 64,
  isBookmarked: false
};

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
  const isOpen = !mobileMenuOverlay.classList.contains('hidden');
  
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

function openMobileMenu() {
  mobileMenuOverlay.classList.remove('hidden');
  hamburgerIcon.classList.add('hidden');
  closeIcon.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenuOverlay.classList.add('hidden');
  hamburgerIcon.classList.remove('hidden');
  closeIcon.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close mobile menu when clicking overlay
mobileMenuOverlay.addEventListener('click', (e) => {
  if (e.target === mobileMenuOverlay) {
    closeMobileMenu();
  }
});

// Bookmark functionality
bookmarkBtn.addEventListener('click', () => {
  appState.isBookmarked = !appState.isBookmarked;
  updateBookmarkButton();
});

function updateBookmarkButton() {
  const bookmarkText = bookmarkBtn.querySelector('.bookmark-text');
  const bookmarkIcon = bookmarkBtn.querySelector('.bookmark-icon svg circle');
  const bookmarkPath = bookmarkBtn.querySelector('.bookmark-icon svg path');
  
  if (appState.isBookmarked) {
    bookmarkBtn.classList.add('bookmarked');
    bookmarkText.textContent = 'Bookmarked';
    bookmarkIcon.setAttribute('fill', '#147B74');
    bookmarkPath.setAttribute('fill', '#FFFFFF');
  } else {
    bookmarkBtn.classList.remove('bookmarked');
    bookmarkText.textContent = 'Bookmark';
    bookmarkIcon.setAttribute('fill', '#2F2F2F');
    bookmarkPath.setAttribute('fill', '#B1B1B1');
  }
}

// Modal functionality
function openPledgeModal(selectedReward = null) {
  pledgeModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Reset all radio buttons and input sections
  pledgeRadios.forEach(radio => {
    radio.checked = false;
    const pledgeOption = radio.closest('.pledge-option');
    pledgeOption.classList.remove('selected');
    const inputSection = pledgeOption.querySelector('.pledge-input-section');
    if (inputSection) {
      inputSection.classList.add('hidden');
    }
  });
  
  // If a specific reward was selected, check that radio button
  if (selectedReward) {
    const targetRadio = document.querySelector(`input[value="${selectedReward}"]`);
    if (targetRadio && !targetRadio.disabled) {
      targetRadio.checked = true;
      handlePledgeSelection(targetRadio);
    }
  }
}

function closePledgeModalFn() {
  pledgeModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function openSuccessModal() {
  successModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModalFn() {
  successModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Event listeners for modal controls
backProjectBtn.addEventListener('click', () => openPledgeModal());
closePledgeModal.addEventListener('click', closePledgeModalFn);
closeSuccessModal.addEventListener('click', closeSuccessModalFn);

// Select reward buttons
selectRewardBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const reward = btn.getAttribute('data-reward');
    openPledgeModal(reward);
  });
});

// Close modals when clicking overlay
pledgeModal.addEventListener('click', (e) => {
  if (e.target === pledgeModal) {
    closePledgeModalFn();
  }
});

successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    closeSuccessModalFn();
  }
});

// Pledge option selection
pledgeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      handlePledgeSelection(radio);
    }
  });
});

function handlePledgeSelection(selectedRadio) {
  // Remove selected class from all options
  pledgeOptions.forEach(option => {
    option.classList.remove('selected');
    const inputSection = option.querySelector('.pledge-input-section');
    if (inputSection) {
      inputSection.classList.add('hidden');
    }
  });
  
  // Add selected class to chosen option
  const selectedOption = selectedRadio.closest('.pledge-option');
  selectedOption.classList.add('selected');
  
  // Show input section for selected option
  const inputSection = selectedOption.querySelector('.pledge-input-section');
  if (inputSection) {
    inputSection.classList.remove('hidden');
  }
}

// Continue button functionality
continueBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const pledgeOption = btn.closest('.pledge-option');
    const pledgeInput = pledgeOption.querySelector('.pledge-input');
    const pledgeValue = pledgeInput ? parseInt(pledgeInput.value) || 0 : 0;
    const rewardType = pledgeOption.getAttribute('data-pledge');
    
    // Validate pledge amount
    if (!validatePledge(rewardType, pledgeValue)) {
      return;
    }
    
    // Process the pledge
    processPledge(rewardType, pledgeValue);
    
    // Close pledge modal and show success modal
    closePledgeModalFn();
    setTimeout(() => {
      openSuccessModal();
    }, 300);
  });
});

function validatePledge(rewardType, amount) {
  const minAmounts = {
    'no-reward': 1,
    'bamboo': 25,
    'black': 75,
    'mahogany': 200
  };
  
  const minAmount = minAmounts[rewardType] || 1;
  
  if (amount < minAmount) {
    alert(`Minimum pledge amount is $${minAmount}`);
    return false;
  }
  
  // Check if reward is still available
  if (rewardType === 'bamboo' && appState.bambooCount <= 0) {
    alert('This reward is no longer available');
    return false;
  }
  
  if (rewardType === 'black' && appState.blackCount <= 0) {
    alert('This reward is no longer available');
    return false;
  }
  
  return true;
}

function processPledge(rewardType, amount) {
  // Update total backed amount
  appState.totalBackedAmount += amount;
  
  // Update total backers count
  appState.totalBackersCount += 1;
  
  // Update reward counts
  if (rewardType === 'bamboo') {
    appState.bambooCount -= 1;
  } else if (rewardType === 'black') {
    appState.blackCount -= 1;
  }
  
  // Update UI
  updateStats();
  updateRewardCounts();
}

function updateStats() {
  // Update total backed amount
  totalBacked.textContent = `$${appState.totalBackedAmount.toLocaleString()}`;
  
  // Update total backers count
  totalBackers.textContent = appState.totalBackersCount.toLocaleString();
  
  // Update progress bar
  const progressPercentage = (appState.totalBackedAmount / 100000) * 100;
  progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
}

function updateRewardCounts() {
  // Update main page reward counts
  bambooLeft.textContent = appState.bambooCount;
  blackLeft.textContent = appState.blackCount;
  
  // Update modal reward counts
  bambooModalLeft.textContent = appState.bambooCount;
  blackModalLeft.textContent = appState.blackCount;
  
  // Disable rewards if out of stock
  const bambooCards = document.querySelectorAll('[data-reward="bamboo"]');
  const blackCards = document.querySelectorAll('[data-reward="black"]');
  
  if (appState.bambooCount <= 0) {
    bambooCards.forEach(card => {
      card.classList.add('out-of-stock');
      const btn = card.querySelector('button');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Out of Stock';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-disabled');
      }
    });
  }
  
  if (appState.blackCount <= 0) {
    blackCards.forEach(card => {
      card.classList.add('out-of-stock');
      const btn = card.querySelector('button');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Out of Stock';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-disabled');
      }
    });
  }
}

// Initialize the application
function init() {
  updateStats();
  updateRewardCounts();
  updateBookmarkButton();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
