define(['ash', 'utils/MathUtils', 'game/constants/CampConstants', 'game/constants/GameConstants'],
function (Ash, MathUtils, CampConstants, GameConstants) {

    var OccurrenceConstants = {
	
		campOccurrenceTypes: {
			trader: "trader",
			raid: "raid",
		},
		
		OCCURRENCE_CAMP_TRADER_LENGTH: 60 * 5,
		OCCURRENCE_CAMP_TRADER_COOLDOWN: 60 * 10,
		OCCURRENCE_CAMP_TRADER_VARIATION: 60 * 25,
		
		OCCURRENCE_CAMP_RAID_LENGTH: 5,
		OCCURRENCE_CAMP_RAID_COOLDOWN: 60 * 15,
		OCCURRENCE_CAMP_RAID_VARIATION: 60 * 60,
		
		scheduleNext: function (occurrenceType, upgradeFactor, campPopulation, campMaxPopulation) {
			var minimumTime = 1;
            var baseTime = 1;
			var randomFactor = Math.random();

            var pop = (campPopulation + campMaxPopulation)/2;
            var populationFactor = MathUtils.clamp(2.25-Math.log(pop+1)/2.5, 0.5, 2);
			
            switch (occurrenceType) {
				case this.campOccurrenceTypes.trader:
					minimumTime = this.OCCURRENCE_CAMP_TRADER_COOLDOWN;
					baseTime = this.OCCURRENCE_CAMP_TRADER_VARIATION;
					break;
				
				case this.campOccurrenceTypes.raid:
					minimumTime = this.OCCURRENCE_CAMP_RAID_COOLDOWN;
					baseTime = this.OCCURRENCE_CAMP_RAID_VARIATION;
					break;
			}
            
            minimumTime *= Math.max(1, populationFactor);
            
            return Math.floor(minimumTime + baseTime * randomFactor * upgradeFactor * populationFactor) / GameConstants.gameSpeedCamp;
		},
		
		getDuration: function(occurrenceType) {
			switch(occurrenceType) {
			case this.campOccurrenceTypes.trader:
				return this.OCCURRENCE_CAMP_TRADER_LENGTH;
			
			case this.campOccurrenceTypes.raid:
				return this.OCCURRENCE_CAMP_RAID_LENGTH;
			}
			return 0;
		},
		
		getRaidDanger: function (improvements, soldiers) {
			var dangerPoints = this.getRaidDangerPoints(improvements)
			var defencePoints = this.getRaidDefencePoints(improvements, soldiers);
            var result = (dangerPoints - defencePoints)/20;
			return Math.max(0, Math.min(1, result));
		},
        
        getRaidDangerPoints: function (improvements) {
			var dangerPoints = 0;
			dangerPoints += improvements.getTotal(improvementTypes.camp);
			dangerPoints -= improvements.getCount(improvementTypes.home);
            dangerPoints -= improvements.getCount(improvementNames.fortification);
            dangerPoints -= improvements.getCount(improvementNames.fortification2);
            return dangerPoints;
        },
		
		getRaidDefencePoints: function (improvements, soldiers) {
			var regularFortifications = improvements.getCount(improvementNames.fortification);
            var improvedFortifications = improvements.getCount(improvementNames.fortification2) * 25;
            return CampConstants.CAMP_BASE_DEFENCE + regularFortifications * 6 + improvedFortifications * 10 + soldiers * 2;
		}
	
    };
    
    return OccurrenceConstants;
    
});
