/**
 * Competition Configuration Tool - Widget Version
 * Embeddable via jsDelivr CDN
 *
 * Usage:
 * <div id="competition-config"></div>
 * <script src="https://cdn.jsdelivr.net/gh/username/repo@main/widget.js"></script>
 * <script>
 *   CompetitionConfig.init('competition-config');
 * </script>
 */

(function() {
    'use strict';

    // Global API
    window.CompetitionConfig = {
        init: function(targetElementId, options) {
            const target = document.getElementById(targetElementId);
            if (!target) {
                console.error(`CompetitionConfig: Element with id "${targetElementId}" not found`);
                return;
            }

            // Inject styles
            injectStyles();

            // Inject HTML
            target.innerHTML = getHTML();

            // Initialize the widget
            initWidget(target, options || {});
        }
    };

    // Inject scoped CSS
    function injectStyles() {
        if (document.getElementById('competition-config-styles')) {
            return; // Already injected
        }

        const style = document.createElement('style');
        style.id = 'competition-config-styles';
        style.textContent = `
            .cc-widget * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .cc-widget {
                font-family: var(--font-family), ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                background: #1a1a1a;
                min-height: 100vh;
                padding: 12px;
            }

            .cc-container {
                max-width: 1000px;
                margin: 0 auto;
                background: #2d2d2d;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                overflow: hidden;
            }

            .cc-content {
                display: grid;
                grid-template-columns: 240px 1fr;
                gap: 0;
                min-height: 600px;
            }

            .cc-sidebar {
                background: #2d2d2d;
                border-right: 1px solid #404040;
                padding: 18px;
                overflow-y: auto;
                max-height: calc(100vh - 200px);
            }

            .cc-main {
                padding: 18px;
                overflow-y: auto;
                max-height: calc(100vh - 200px);
            }

            .cc-section {
                margin-bottom: 20px;
            }

            .cc-section h3 {
                font-size: 0.95rem;
                color: #e0e0e0;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid #404040;
            }

            .cc-input-group {
                margin-bottom: 14px;
            }

            .cc-input-group label {
                display: block;
                font-size: 0.8rem;
                font-weight: 600;
                color: #b0b0b0;
                margin-bottom: 4px;
            }

            .cc-input-group input,
            .cc-input-group select {
                width: 100%;
                background: #3a3a3a;
                color: #e0e0e0;
                border: 1px solid #505050;
                padding: 7px 10px;
                border-radius: 6px;
                font-size: 0.85rem;
                transition: border-color 0.2s;
            }

            .cc-input-group input:focus,
            .cc-input-group select:focus {
                outline: none;
                border-color: #667eea;
            }

            .cc-input-group small {
                display: block;
                color: #808080;
                font-size: 0.7rem;
                margin-top: 3px;
            }

            .cc-rounds-config {
                background: #1a1a1a;
                border: 1px solid #404040;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
            }

            .cc-rounds-config h4 {
                font-size: 0.85rem;
                color:rgb(255, 255, 255);
                margin-bottom: 10px;
            }

            .cc-round-input {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 8px;
            }

            .cc-btn {
                background: linear-gradient(135deg,rgb(129, 129, 129) 0%,rgb(70, 70, 70) 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .cc-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .cc-btn:active {
                transform: translateY(0);
            }

            .cc-btn-small {
                width: 100%;
                padding: 6px 10px;
                font-size: 0.75rem;
            }

            .cc-presets {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 10px;
            }

            .cc-alert {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 15px;
                border-left: 4px solid;
            }

            .cc-alert-success {
                background: #1e3a2e;
                border-color:rgb(23, 85, 37);
                color:rgb(98, 167, 123);
            }

            .cc-alert-error {
                background: #3a1e1e;
                border-color: #dc3545;
                color: #f88f8f;
            }

            .cc-alert-warning {
                background: #3a3020;
                border-color: #ffc107;
                color: #ffd966;
            }

            .cc-alert h4 {
                font-size: 0.85rem;
            }

            .cc-alert ul {
                font-size: 0.85rem;
                margin-top: 6px;
            }

            .cc-alert ul {
                margin-left: 20px;
                font-size: 0.8rem;
            }

            .cc-alert li {
                margin-bottom: 4px;
            }

            .cc-summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
                margin-bottom: 18px;
            }

            .cc-card {
                background: #1a1a1a;
                border: 1px solid #404040;
                border-radius: 8px;
                padding: 12px;
                text-align: center;
            }

            .cc-card-value {
                font-size: 1.5rem;
                font-weight: 700;
                color:rgb(255, 255, 255);
                margin-bottom: 4px;
            }

            .cc-card-label {
                font-size: 0.75rem;
                color: #a0a0a0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .cc-table-wrapper {
                overflow-x: auto;
                border: 1px solid #404040;
                border-radius: 8px;
                margin-bottom: 15px;
            }

            .cc-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.8rem;
            }

            .cc-table thead {
                background: #1a1a1a;
            }

            .cc-table th {
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                color: #b0b0b0;
                border-bottom: 2px solid #404040;
                font-size: 0.75rem;
            }

            .cc-table td {
                padding: 8px 10px;
                border-bottom: 1px solid #404040;
                color: #e0e0e0;
            }

            .cc-round-header-row td {
                background: #252525;
                border-bottom: 1px solid #505050;
                padding: 6px 10px;
                font-size: 0.8rem;
            }

            .cc-round-data-row td {
                border-bottom: 1px solid #404040;
                padding-bottom: 10px;
            }

            .cc-round-header-row:not(:first-child) td {
                padding-top: 10px;
            }

            .cc-info-icon {
                display: inline-block;
                margin-left: 4px;
                color: #8b9dc3;
                font-size: 0.9rem;
                cursor: help;
                opacity: 0.7;
            }

            .cc-info-icon:hover {
                opacity: 1;
            }

            .cc-table tbody tr:hover {
                background: #3a3a3a;
            }

            .cc-table tbody tr.cc-round-header-row:hover {
                background: #252525;
            }

            .cc-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .cc-badge-warning {
                background: #ffc107;
                color: #000;
            }

            .cc-flow-diagram {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
                gap: 4px 0;
                margin: 15px 0;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid #404040;
                border-radius: 8px;
            }

            .cc-flow-item {
                text-align: center;
                min-width: 60px;
                padding: 4px 8px;
            }

            .cc-flow-value {
                font-size: 1rem;
                font-weight: 700;
                color:rgb(255, 255, 255);
            }

            .cc-flow-label {
                font-size: 0.65rem;
                color: #a0a0a0;
                margin-top: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 80px;
            }

            .cc-flow-arrow {
                font-size: 1.2rem;
                color: #505050;
                margin: 0 2px;
            }

            .cc-calculating-indicator {
                display: none;
                text-align: center;
                padding: 8px;
                background: #667eea15;
                border-radius: 6px;
                margin-bottom: 15px;
                font-size: 0.85rem;
                color:rgb(255, 255, 255);
                animation: cc-pulse 1s infinite;
            }

            .cc-calculating-indicator.active {
                display: block;
            }

            @keyframes cc-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @media (max-width: 1024px) {
                .cc-content {
                    grid-template-columns: 1fr;
                }

                .cc-sidebar {
                    max-height: none;
                    border-right: none;
                    border-bottom: 1px solid #404040;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Get HTML structure
    function getHTML() {
        return `
            <div class="cc-widget">
                <div class="cc-container">
                    <div class="cc-content">
                        <div class="cc-sidebar">
                            <div class="cc-section">
                                <h3>Competition Settings</h3>

                                <div class="cc-input-group">
                                    <label for="cc-startingCompetitors">Starting Competitors</label>
                                    <input type="number" id="cc-startingCompetitors" value="63000" min="100" step="100" />
                                    <small>Total number of participants entering</small>
                                </div>

                                <div class="cc-input-group">
                                    <label for="cc-targetFinalists">Target Finalists</label>
                                    <input type="number" id="cc-targetFinalists" value="100" min="10" step="10" />
                                    <small>Desired number of finalists</small>
                                </div>

                                <div class="cc-input-group">
                                    <label for="cc-numberOfRounds">Number of Rounds</label>
                                    <select id="cc-numberOfRounds">
                                        <option value="2">2 Rounds</option>
                                        <option value="3">3 Rounds</option>
                                        <option value="4" selected>4 Rounds</option>
                                        <option value="5">5 Rounds</option>
                                        <option value="6">6 Rounds</option>
                                        <option value="7">7 Rounds</option>
                                        <option value="8">8 Rounds</option>
                                        <option value="9">9 Rounds</option>
                                        <option value="10">10 Rounds</option>
                                    </select>
                                </div>

                                <div class="cc-input-group">
                                    <label for="cc-roundDuration">Round Duration (days)</label>
                                    <input type="number" id="cc-roundDuration" value="4" min="1" max="30" />
                                    <small>Applied to all rounds</small>
                                </div>

                                <div class="cc-input-group">
                                    <label for="cc-startDate">Start Date</label>
                                    <input type="date" id="cc-startDate" value="2025-11-04" />
                                </div>
                            </div>

                            <div class="cc-section">
                                <h3>Round Configuration</h3>
                                <div id="cc-roundsContainer"></div>
                            </div>

                            <div class="cc-presets">
                                <small style="color: #aaa; margin-bottom: 2px;">Presets</small>
                                <button class="cc-btn cc-btn-small" id="cc-preset1">4 Rounds (16 days)</button>
                                <button class="cc-btn cc-btn-small" id="cc-preset2">5 Rounds (20 days)</button>
                                <button class="cc-btn cc-btn-small" id="cc-preset3">8 Rounds (16 days)</button>
                                <button class="cc-btn cc-btn-small" id="cc-preset4">10 Rounds (20 days)</button>
                            </div>
                            <button class="cc-btn" id="cc-calculate-btn">🔄 Recalculate Now</button>
                        </div>

                        <div class="cc-main">
                            <div class="cc-calculating-indicator" id="cc-calculatingIndicator">
                                ⚙️ Calculating...
                            </div>

                            <div id="cc-validationMessages"></div>

                            <div class="cc-summary-cards" id="cc-summaryCards"></div>

                            <div id="cc-flowDiagram"></div>

                            <div class="cc-table-wrapper">
                                <table class="cc-table">
                                    <thead>
                                        <tr>
                                            <th>Round</th>
                                            <th>Groups</th>
                                            <th>People/Group</th>
                                            <th>Gate Size</th>
                                            <th>Total</th>
                                            <th>Advancing</th>
                                        </tr>
                                    </thead>
                                    <tbody id="cc-resultsTable">
                                        <tr>
                                            <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                                                Click "Calculate Competition" to see results
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Widget initialization
    function initWidget(container, options) {
        // Competition logic classes
        class Round {
            constructor(config) {
                this.name = config.name || '';
                this.totalCompetitors = config.totalCompetitors || 0;
                this.numberOfGroups = config.numberOfGroups || null;
                this.gateSize = config.gateSize || 0;
                this.peoplePerGroup = config.peoplePerGroup || null;
                this.startDate = config.startDate || null;
                this.endDate = config.endDate || null;
                this.duration = config.duration || 4;
            }

            calculateMissingValue() {
                if (this.numberOfGroups && !this.peoplePerGroup) {
                    this.peoplePerGroup = this.totalCompetitors / this.numberOfGroups;
                } else if (this.peoplePerGroup && !this.numberOfGroups) {
                    this.numberOfGroups = Math.round(this.totalCompetitors / this.peoplePerGroup);
                    
                    // CRITICAL: Ensure we always have at least 1 group
                    // If peoplePerGroup is too large, we'd get 0 groups, which breaks everything
                    if (this.numberOfGroups === 0 && this.totalCompetitors > 0) {
                        this.numberOfGroups = 1;
                    }
                    
                    this.peoplePerGroup = this.totalCompetitors / this.numberOfGroups;
                }
            }

            getAdvancingCompetitors() {
                return this.numberOfGroups * this.gateSize;
            }

            calculateEndDate() {
                if (this.startDate && this.duration) {
                    const start = new Date(this.startDate);
                    const end = new Date(start);
                    end.setDate(end.getDate() + this.duration - 1);
                    this.endDate = end.toISOString().split('T')[0];
                }
            }

            validate(index) {
                const errors = [];
                const warnings = [];

                if (!Number.isInteger(this.numberOfGroups)) {
                    errors.push(`Round ${index + 1}: numberOfGroups must be integer`);
                }

                if (!Number.isInteger(this.gateSize)) {
                    errors.push(`Round ${index + 1}: gateSize must be integer`);
                }

                const advancing = this.getAdvancingCompetitors();
                if (!Number.isInteger(advancing)) {
                    errors.push(`Round ${index + 1}: advancing must be integer`);
                }

                if (index > 0 && !Number.isInteger(this.peoplePerGroup)) {
                    warnings.push(`Round ${index + 1}: peoplePerGroup should be integer in middle rounds`);
                }

                if (this.gateSize > this.peoplePerGroup) {
                    errors.push(`Round ${index + 1}: gateSize (${this.gateSize}) cannot exceed peoplePerGroup (${this.peoplePerGroup}) - not enough entries available to advance`);
                }

                return { errors, warnings };
            }
        }

        class Competition {
            constructor(config) {
                this.name = config.name || '';
                this.startingCompetitors = config.startingCompetitors || 0;
                this.targetFinalists = config.targetFinalists || 0;
                this.startDate = config.startDate || null;
                this.rounds = [];

                if (config.rounds) {
                    config.rounds.forEach(r => this.rounds.push(new Round(r)));
                }
            }

            calculateAllRounds() {
                if (this.rounds.length === 0) return;

                this.rounds[0].totalCompetitors = this.startingCompetitors;
                this.rounds[0].startDate = this.startDate;
                this.rounds[0].calculateMissingValue();
                this.rounds[0].calculateEndDate();

                for (let i = 1; i < this.rounds.length; i++) {
                    const prevRound = this.rounds[i - 1];
                    const isFinalRound = i === this.rounds.length - 1;
                    
                    this.rounds[i].totalCompetitors = prevRound.getAdvancingCompetitors();

                    if (prevRound.endDate) {
                        const prevEnd = new Date(prevRound.endDate);
                        prevEnd.setDate(prevEnd.getDate() + 1);
                        this.rounds[i].startDate = prevEnd.toISOString().split('T')[0];
                    }

                    // Final round: respect manual groups override, default to 1
                    if (isFinalRound) {
                        if (!this.rounds[i].numberOfGroups) {
                            this.rounds[i].numberOfGroups = 1;
                        }
                        // Recalculate peoplePerGroup based on actual totalCompetitors and groups
                        this.rounds[i].peoplePerGroup = this.rounds[i].totalCompetitors / this.rounds[i].numberOfGroups;
                    } else {
                        this.rounds[i].calculateMissingValue();
                    }
                    
                    this.rounds[i].calculateEndDate();
                }
            }

            validate() {
                const errors = [];
                const warnings = [];

                this.rounds.forEach((round, index) => {
                    const validation = round.validate(index);
                    errors.push(...validation.errors);
                    warnings.push(...validation.warnings);

                    // Check cascade consistency: groups × PPG should equal total competitors
                    const expectedTotal = round.numberOfGroups * round.peoplePerGroup;
                    const actualTotal = round.totalCompetitors;
                    const cascadeDiff = Math.abs(expectedTotal - actualTotal);
                    if (cascadeDiff > 1) {
                        warnings.push(`Round ${index + 1}: ${round.numberOfGroups} groups × ${round.peoplePerGroup.toFixed(1)} PPG = ${expectedTotal.toLocaleString()}, but ${actualTotal.toLocaleString()} competitors entered`);
                    }
                });

                if (this.rounds.length > 0) {
                    const finalRound = this.rounds[this.rounds.length - 1];
                    if (finalRound.numberOfGroups !== 1) {
                        warnings.push(`Final round typically has 1 group, but is set to ${finalRound.numberOfGroups}`);
                    }
                }

                if (this.rounds.length > 0) {
                    const finalRound = this.rounds[this.rounds.length - 1];
                    const actualFinalists = finalRound.totalCompetitors;
                    const diff = Math.abs(actualFinalists - this.targetFinalists);
                    const percentDiff = (diff / this.targetFinalists) * 100;

                    if (percentDiff > 5) {
                        warnings.push(`Target finalists: ${this.targetFinalists}, actual: ${actualFinalists} (${percentDiff.toFixed(1)}% difference)`);
                    }
                }

                return {
                    valid: errors.length === 0,
                    errors,
                    warnings
                };
            }

            getSummary() {
                const finalRound = this.rounds[this.rounds.length - 1];
                return {
                    name: this.name,
                    startingCompetitors: this.startingCompetitors,
                    actualFinalists: finalRound ? finalRound.totalCompetitors : 0,
                    numberOfRounds: this.rounds.length,
                    startDate: this.startDate,
                    endDate: finalRound ? finalRound.endDate : null
                };
            }
        }

        // Widget state
        let currentCompetition = null;

        // Session storage helpers
        function saveSettings() {
            const settings = {
                startingCompetitors: container.querySelector('#cc-startingCompetitors').value,
                targetFinalists: container.querySelector('#cc-targetFinalists').value,
                numberOfRounds: container.querySelector('#cc-numberOfRounds').value,
                roundDuration: container.querySelector('#cc-roundDuration').value,
                startDate: container.querySelector('#cc-startDate').value,
                rounds: []
            };

            const numRounds = parseInt(settings.numberOfRounds);
            for (let i = 0; i < numRounds; i++) {
                const gateField = container.querySelector(`#cc-round${i}Gate`);
                const peopleField = container.querySelector(`#cc-round${i}People`);
                const groupsField = container.querySelector(`#cc-round${i}Groups`);

                settings.rounds.push({
                    gate: gateField ? gateField.value : '',
                    people: i > 0 && peopleField ? peopleField.value : '',
                    groups: groupsField ? groupsField.value : ''
                });
            }

            sessionStorage.setItem('competitionSettings', JSON.stringify(settings));
        }

        function loadSettings() {
            const saved = sessionStorage.getItem('competitionSettings');
            if (!saved) return false;

            try {
                const settings = JSON.parse(saved);

                container.querySelector('#cc-startingCompetitors').value = settings.startingCompetitors || '63000';
                container.querySelector('#cc-targetFinalists').value = settings.targetFinalists || '100';
                container.querySelector('#cc-numberOfRounds').value = settings.numberOfRounds || '4';
                container.querySelector('#cc-roundDuration').value = settings.roundDuration || '4';
                container.querySelector('#cc-startDate').value = settings.startDate || '2025-11-04';

                updateRoundsUI();

                if (settings.rounds) {
                    const numRounds = parseInt(settings.numberOfRounds || '4');
                    const finalRoundIndex = numRounds - 1;
                    
                    settings.rounds.forEach((round, i) => {
                        const gateField = container.querySelector(`#cc-round${i}Gate`);
                        const peopleField = container.querySelector(`#cc-round${i}People`);
                        const groupsField = container.querySelector(`#cc-round${i}Groups`);

                        if (gateField && round.gate) {
                            gateField.value = round.gate;
                        }
                        if (groupsField && round.groups) {
                            groupsField.value = round.groups;
                        }
                        if (i > 0 && peopleField && round.people) {
                            // For final round, use Target Finalists value instead of saved value
                            if (i === finalRoundIndex) {
                                const targetFinalists = settings.targetFinalists || '100';
                                peopleField.value = targetFinalists;
                            } else {
                                peopleField.value = round.people;
                            }
                        }
                    });
                } else {
                    // If no saved rounds, ensure final round is synced
                    updateFinalRoundPeopleField();
                }

                return true;
            } catch (e) {
                console.error('Error loading settings:', e);
                return false;
            }
        }

        function getAutomaticRoundName(index, totalRounds) {
            const positionFromEnd = totalRounds - index - 1;

            if (positionFromEnd === 0) {
                return "Final Round";
            } else if (positionFromEnd === 1) {
                return "Semifinal Round";
            } else if (positionFromEnd === 2) {
                return "Quarterfinal Round";
            } else {
                return `Round ${index + 1}`;
            }
        }

        function updateRoundsUI() {
            const numRounds = parseInt(container.querySelector('#cc-numberOfRounds').value);
            const roundsContainer = container.querySelector('#cc-roundsContainer');
            const targetFinalists = container.querySelector('#cc-targetFinalists')?.value || '100';
            roundsContainer.innerHTML = '';

            for (let i = 0; i < numRounds; i++) {
                const roundName = getAutomaticRoundName(i, numRounds);
                const isFinalRound = i === numRounds - 1;
                const roundDiv = document.createElement('div');
                roundDiv.className = 'cc-rounds-config';
                roundDiv.innerHTML = `
                    <h4>${roundName}</h4>
                    ${i === 0 ? `
                        <div class="cc-round-input">
                            <div class="cc-input-group">
                                <label>Groups</label>
                                <input type="number" id="cc-round${i}Groups" placeholder="auto" min="1" />
                                <small>Leave blank for auto-calc</small>
                            </div>
                            <div class="cc-input-group">
                                <label>People/Group</label>
                                <input type="number" id="cc-round${i}People" value="25.20" step="0.01" readonly style="background: #3a3a3a; cursor: not-allowed;" />
                                <small>Calculated automatically</small>
                            </div>
                            <div class="cc-input-group">
                                <label>Gate Size</label>
                                <input type="number" id="cc-round${i}Gate" value="4" min="1" />
                            </div>
                        </div>
                    ` : isFinalRound ? `
                        <div class="cc-round-input">
                            <div class="cc-input-group">
                                <label>Groups</label>
                                <input type="number" id="cc-round${i}Groups" value="1" min="1" />
                                <small>Usually 1 for final</small>
                            </div>
                            <div class="cc-input-group">
                                <label>People/Group</label>
                                <input type="number" id="cc-round${i}People" value="${targetFinalists}" min="1" readonly style="background: #3a3a3a; cursor: not-allowed;" />
                                <small>Synced with Target Finalists</small>
                            </div>
                            <div class="cc-input-group">
                                <label>Gate Size</label>
                                <input type="number" id="cc-round${i}Gate" value="20" min="1" />
                            </div>
                        </div>
                    ` : `
                        <div class="cc-round-input">
                            <div class="cc-input-group">
                                <label>Groups</label>
                                <input type="number" id="cc-round${i}Groups" placeholder="auto" min="1" />
                                <small>Leave blank for auto-calc</small>
                            </div>
                            <div class="cc-input-group">
                                <label>People/Group</label>
                                <input type="number" id="cc-round${i}People" value="20" min="1" />
                            </div>
                            <div class="cc-input-group">
                                <label>Gate Size</label>
                                <input type="number" id="cc-round${i}Gate" value="2" min="1" />
                            </div>
                        </div>
                    `}
                `;
                roundsContainer.appendChild(roundDiv);
            }
        }

        function calculate() {
            const indicator = container.querySelector('#cc-calculatingIndicator');
            if (indicator) indicator.classList.add('active');

            const numRounds = parseInt(container.querySelector('#cc-numberOfRounds').value);
            const roundDuration = parseInt(container.querySelector('#cc-roundDuration').value);
            const rounds = [];

            for (let i = 0; i < numRounds; i++) {
                const name = getAutomaticRoundName(i, numRounds);
                const gateSize = parseInt(container.querySelector(`#cc-round${i}Gate`).value);

                // Check for manual groups override
                const groupsField = container.querySelector(`#cc-round${i}Groups`);
                const manualGroups = groupsField && groupsField.value.trim() !== ''
                    ? parseInt(groupsField.value)
                    : null;

                if (i === 0) {
                    rounds.push({
                        name,
                        gateSize,
                        duration: roundDuration,
                        numberOfGroups: manualGroups  // Use manual if set, null for auto-calc
                    });
                } else {
                    const isFinalRound = i === numRounds - 1;
                    // For final round, use Target Finalists directly instead of reading from the field
                    const peoplePerGroup = isFinalRound
                        ? parseInt(container.querySelector('#cc-targetFinalists').value)
                        : parseInt(container.querySelector(`#cc-round${i}People`).value);
                    rounds.push({
                        name,
                        peoplePerGroup,
                        gateSize,
                        duration: roundDuration,
                        numberOfGroups: manualGroups  // Use manual if set, null for auto-calc
                    });
                }
            }

            if (rounds.length > 0) {
                const startingCompetitors = parseInt(container.querySelector('#cc-startingCompetitors').value);
                const targetFinalists = parseInt(container.querySelector('#cc-targetFinalists').value);

                // Calculate groups needed for ALL rounds by working backwards from target finalists
                // Store calculated values to use as placeholders and fallbacks
                const calculatedGroups = new Array(rounds.length).fill(null);

                // Final round: 1 group with all finalists
                calculatedGroups[rounds.length - 1] = 1;

                // Work backwards from the final round
                let competitorsNeeded = targetFinalists;

                for (let i = rounds.length - 1; i > 0; i--) {
                    // Use the PREVIOUS round's gateSize to calculate how many groups are needed there
                    const prevGateSize = rounds[i - 1].gateSize;
                    const groupsNeededInPrev = Math.ceil(competitorsNeeded / prevGateSize);

                    if (i === 1) {
                        // Round 1: apply safety constraints
                        const maxPossibleGroups = Math.floor(startingCompetitors / rounds[0].gateSize);
                        let round1Groups = Math.min(groupsNeededInPrev, maxPossibleGroups);
                        round1Groups = Math.max(1, round1Groups);
                        calculatedGroups[0] = round1Groups;
                    } else {
                        // Middle rounds
                        calculatedGroups[i - 1] = groupsNeededInPrev;
                    }

                    // Calculate how many competitors round i-1 needs to have
                    const ppg = rounds[i - 1].peoplePerGroup || 20;
                    competitorsNeeded = groupsNeededInPrev * ppg;
                }

                // Check if R1 has a manual override
                const r1HasManualOverride = rounds[0].numberOfGroups !== null;

                // Apply calculated values where manual override is not set
                // and update placeholder attributes to show auto-calculated values
                for (let i = 0; i < rounds.length; i++) {
                    const groupsField = container.querySelector(`#cc-round${i}Groups`);

                    // Update placeholder to show what auto-calc produces
                    if (groupsField && calculatedGroups[i] !== null) {
                        groupsField.placeholder = calculatedGroups[i].toString();
                    }

                    // Apply calculated value if no manual override
                    if (rounds[i].numberOfGroups === null) {
                        // If R1 has manual override, only apply auto-calc to R1
                        // Let middle rounds derive groups from PPG during cascade calculation
                        if (i === 0 || !r1HasManualOverride) {
                            rounds[i].numberOfGroups = calculatedGroups[i] || 1;
                        }
                        // For middle/final rounds when R1 is manual, leave null
                        // so Competition.calculateAllRounds() derives from PPG
                    }
                }

                // Fallback for Round 1 if still null
                if (rounds[0].numberOfGroups === null || rounds[0].numberOfGroups === 0) {
                    const defaultPeoplePerGroup = 25;
                    rounds[0].numberOfGroups = Math.max(1, Math.round(startingCompetitors / defaultPeoplePerGroup));
                }
            }

            currentCompetition = new Competition({
                name: '',
                startingCompetitors: parseInt(container.querySelector('#cc-startingCompetitors').value),
                targetFinalists: parseInt(container.querySelector('#cc-targetFinalists').value),
                startDate: container.querySelector('#cc-startDate').value,
                rounds
            });

            currentCompetition.calculateAllRounds();

            if (currentCompetition.rounds.length > 0) {
                const round1PeoplePerGroup = currentCompetition.rounds[0].peoplePerGroup;
                const round1Field = container.querySelector('#cc-round0People');
                if (round1Field) {
                    round1Field.value = Number.isInteger(round1PeoplePerGroup)
                        ? round1PeoplePerGroup.toString()
                        : round1PeoplePerGroup.toFixed(2);
                }
                
                // Update final round People/Group field to match Target Finalists
                const numRounds = parseInt(container.querySelector('#cc-numberOfRounds').value);
                const finalRoundIndex = numRounds - 1;
                const finalRoundPeopleField = container.querySelector(`#cc-round${finalRoundIndex}People`);
                const targetFinalists = container.querySelector('#cc-targetFinalists').value;
                if (finalRoundPeopleField) {
                    finalRoundPeopleField.value = targetFinalists;
                }
            }

            displayResults();
        }

        function displayResults() {
            if (!currentCompetition) {
                const indicator = container.querySelector('#cc-calculatingIndicator');
                if (indicator) indicator.classList.remove('active');
                return;
            }

            const validation = currentCompetition.validate();
            const summary = currentCompetition.getSummary();

            displayValidation(validation);
            displaySummary(summary);
            displayFlowDiagram();
            displayTable();

            const indicator = container.querySelector('#cc-calculatingIndicator');
            if (indicator) indicator.classList.remove('active');
        }

        function displayValidation(validation) {
            const messagesContainer = container.querySelector('#cc-validationMessages');
            messagesContainer.innerHTML = '';

            if (validation.valid && validation.warnings.length === 0) {
                messagesContainer.innerHTML = `
                    <div class="cc-alert cc-alert-success">
                        <h4>✅ Configuration Valid</h4>
                    </div>
                `;
            } else {
                if (validation.errors.length > 0) {
                    messagesContainer.innerHTML += `
                        <div class="cc-alert cc-alert-error">
                            <h4>❌ Errors Found</h4>
                            <ul>
                                ${validation.errors.map(e => `<li>${e}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
                if (validation.warnings.length > 0) {
                    messagesContainer.innerHTML += `
                        <div class="cc-alert cc-alert-warning">
                            <h4>⚠️ Warnings</h4>
                            <ul>
                                ${validation.warnings.map(w => `<li>${w}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            }
        }

        function displaySummary(summary) {
            const cardsContainer = container.querySelector('#cc-summaryCards');
            cardsContainer.innerHTML = `
                <div class="cc-card">
                    <div class="cc-card-value">${summary.startingCompetitors.toLocaleString()}</div>
                    <div class="cc-card-label">Starting</div>
                </div>
                <div class="cc-card">
                    <div class="cc-card-value">${summary.actualFinalists}</div>
                    <div class="cc-card-label">Finalists</div>
                </div>
                <div class="cc-card">
                    <div class="cc-card-value">${summary.numberOfRounds}</div>
                    <div class="cc-card-label">Rounds</div>
                </div>
            `;
        }

        function displayFlowDiagram() {
            const flowContainer = container.querySelector('#cc-flowDiagram');
            const items = currentCompetition.rounds.map((round, i) => {
                return `
                    <div class="cc-flow-item">
                        <div class="cc-flow-value">${round.totalCompetitors.toLocaleString()}</div>
                        <div class="cc-flow-label">${round.name}</div>
                    </div>
                    ${i < currentCompetition.rounds.length - 1 ? '<div class="cc-flow-arrow">→</div>' : ''}
                `;
            }).join('');

            flowContainer.innerHTML = `<div class="cc-flow-diagram">${items}</div>`;
        }

        function formatDateLong(dateStr) {
            if (!dateStr || dateStr === 'N/A') return 'N/A';
            const date = new Date(dateStr + 'T00:00:00');
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        function displayTable() {
            const tbody = container.querySelector('#cc-resultsTable');
            tbody.innerHTML = currentCompetition.rounds.map((round, i) => {
                const isFinalRound = i === currentCompetition.rounds.length - 1;
                const isFractional = !Number.isInteger(round.peoplePerGroup);

                const peoplePerGroupFormatted = Number.isInteger(round.peoplePerGroup)
                    ? round.peoplePerGroup.toString()
                    : round.peoplePerGroup.toFixed(2);

                return `
                    <tr class="cc-round-header-row">
                        <td colspan="6" style="font-weight: 600;">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                                <span>${round.name}</span>
                                <span style="font-size: 0.75rem; opacity: 0.85;">${formatDateLong(round.startDate)} – ${formatDateLong(round.endDate)}</span>
                            </div>
                        </td>
                    </tr>
                    <tr class="cc-round-data-row">
                        <td><strong>${i + 1}</strong></td>
                        <td>
                            ${round.numberOfGroups.toLocaleString()}
                            ${isFinalRound && round.numberOfGroups > 1 ? '<span class="cc-badge cc-badge-warning">Should be 1 group</span>' : ''}
                        </td>
                        <td>
                            ${peoplePerGroupFormatted}
                            ${isFractional && i === 0 ? '<span class="cc-info-icon" title="Fractional value is OK in Round 1">ⓘ</span>' : ''}
                            ${isFractional && i > 0 ? '<span class="cc-badge cc-badge-warning">Should be integer</span>' : ''}
                        </td>
                        <td>${round.gateSize}</td>
                        <td>${round.totalCompetitors.toLocaleString()}</td>
                        <td>${round.getAdvancingCompetitors().toLocaleString()}</td>
                    </tr>
                `;
            }).join('');
        }

        function getNextFourth() {
            const today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();

            // Check if the 4th of this month is still upcoming
            const fourthThisMonth = new Date(year, month, 4);
            if (fourthThisMonth > today) {
                return fourthThisMonth.toISOString().split('T')[0];
            }

            // Otherwise, get the 4th of next month
            month++;
            if (month > 11) {
                month = 0;
                year++;
            }
            const fourthNextMonth = new Date(year, month, 4);
            return fourthNextMonth.toISOString().split('T')[0];
        }

        function loadPreset(presetNum) {
            const startDate = getNextFourth();

            // Common settings for all presets
            container.querySelector('#cc-startingCompetitors').value = '52000';
            container.querySelector('#cc-targetFinalists').value = '100';
            container.querySelector('#cc-startDate').value = startDate;

            const presets = {
                1: {
                    // 4 rounds, 4 days each
                    numRounds: 4,
                    duration: 4,
                    rounds: [
                        { groups: '2500', gate: '4' },
                        { people: '20', gate: '2' },
                        { people: '20', gate: '2' },
                        { gate: '20' }  // Final
                    ]
                },
                2: {
                    // 5 rounds, 4 days each
                    numRounds: 5,
                    duration: 4,
                    rounds: [
                        { groups: '6250', gate: '4' },
                        { people: '20', gate: '4' },
                        { people: '20', gate: '4' },
                        { people: '20', gate: '2' },
                        { gate: '20' }  // Final
                    ]
                },
                3: {
                    // 8 rounds, 2 days each
                    numRounds: 8,
                    duration: 2,
                    rounds: [
                        { groups: '2560', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '5' },
                        { people: '20', gate: '5' },
                        { gate: '20' }  // Final
                    ]
                },
                4: {
                    // 10 rounds, 2 days each
                    numRounds: 10,
                    duration: 2,
                    rounds: [
                        { groups: '2560', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { people: '20', gate: '10' },
                        { gate: '20' }  // Final
                    ]
                }
            };

            const preset = presets[presetNum] || presets[1];

            container.querySelector('#cc-numberOfRounds').value = preset.numRounds.toString();
            container.querySelector('#cc-roundDuration').value = preset.duration.toString();

            updateRoundsUI();

            setTimeout(() => {
                preset.rounds.forEach((round, i) => {
                    if (round.groups) {
                        const groupsField = container.querySelector(`#cc-round${i}Groups`);
                        if (groupsField) groupsField.value = round.groups;
                    }
                    if (round.people) {
                        const peopleField = container.querySelector(`#cc-round${i}People`);
                        if (peopleField) peopleField.value = round.people;
                    }
                    if (round.gate) {
                        const gateField = container.querySelector(`#cc-round${i}Gate`);
                        if (gateField) gateField.value = round.gate;
                    }
                });
                updateFinalRoundPeopleField();
                setupRoundListeners();
                saveSettings();
                calculate();
            }, 100);
        }

        function setupAutoCalculate() {
            let calcTimer = null;

            function autoCalculate() {
                clearTimeout(calcTimer);
                calcTimer = setTimeout(() => {
                    updateFinalRoundPeopleField();
                    saveSettings();
                    calculate();
                }, 300);
            }

            container.querySelector('#cc-startingCompetitors').addEventListener('input', autoCalculate);
            container.querySelector('#cc-targetFinalists').addEventListener('input', autoCalculate);
            container.querySelector('#cc-roundDuration').addEventListener('input', autoCalculate);
            container.querySelector('#cc-startDate').addEventListener('change', autoCalculate);
        }

        function setupRoundListeners() {
            const numRounds = parseInt(container.querySelector('#cc-numberOfRounds').value);
            const finalRoundIndex = numRounds - 1;
            let calcTimer = null;

            function autoCalculate() {
                clearTimeout(calcTimer);
                calcTimer = setTimeout(() => {
                    saveSettings();
                    calculate();
                }, 300);
            }

            for (let i = 0; i < numRounds; i++) {
                const gateField = container.querySelector(`#cc-round${i}Gate`);
                if (gateField) gateField.addEventListener('input', autoCalculate);

                // Add listener for Groups field (all rounds)
                const groupsField = container.querySelector(`#cc-round${i}Groups`);
                if (groupsField) groupsField.addEventListener('input', autoCalculate);

                if (i > 0) {
                    const peopleField = container.querySelector(`#cc-round${i}People`);
                    // Skip adding listener for final round since it's readonly
                    if (peopleField && i !== finalRoundIndex) {
                        peopleField.addEventListener('input', autoCalculate);
                    }
                }
            }
        }

        function updateFinalRoundPeopleField() {
            const numRounds = parseInt(container.querySelector('#cc-numberOfRounds').value);
            const finalRoundIndex = numRounds - 1;
            const finalRoundPeopleField = container.querySelector(`#cc-round${finalRoundIndex}People`);
            const targetFinalists = container.querySelector('#cc-targetFinalists')?.value || '100';
            if (finalRoundPeopleField) {
                finalRoundPeopleField.value = targetFinalists;
            }
        }

        function updateRoundsUIWithListeners() {
            updateRoundsUI();
            setTimeout(() => {
                updateFinalRoundPeopleField();
                setupRoundListeners();
                saveSettings();
                calculate();
            }, 100);
        }

        // Initialize
        function init() {
            updateRoundsUI();

            const loaded = loadSettings();
            if (loaded) {
                setTimeout(() => {
                    updateFinalRoundPeopleField();
                    setupRoundListeners();
                    calculate();
                }, 100);
            } else {
                loadPreset(1);
            }
        }

        // Event listeners
        container.querySelector('#cc-numberOfRounds').addEventListener('change', updateRoundsUIWithListeners);
        container.querySelector('#cc-calculate-btn').addEventListener('click', calculate);
        container.querySelector('#cc-preset1').addEventListener('click', () => loadPreset(1));
        container.querySelector('#cc-preset2').addEventListener('click', () => loadPreset(2));
        container.querySelector('#cc-preset3').addEventListener('click', () => loadPreset(3));
        container.querySelector('#cc-preset4').addEventListener('click', () => loadPreset(4));

        // Start
        init();
        setupAutoCalculate();
        setupRoundListeners();
    }

})();
