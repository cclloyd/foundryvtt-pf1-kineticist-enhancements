{
    "name": "Nao",
    "type": "character",
    "img": "assets/heavy-rain/icons/player-icons/nao/846e31ba-b24c-4f24-8075-74f9a23891ef.webp",
    "folder": "2Fq6H9DZRpCNQsMz",
    "sort": 700000,
    "flags": {
    "system": {
    "abilities": {
        "str": {
            "value": 14,
                "damage": 4,
                "drain": 0,
                "userPenalty": 0,
                "carryBonus": null,
                "carryMultiplier": null
        },
        "dex": {
            "value": 14,
                "damage": 0,
                "drain": 0,
                "userPenalty": 0
        },
        "con": {
            "value": 15,
                "damage": 0,
                "drain": 0,
                "userPenalty": 0
        },
        "int": {
            "value": 13,
                "damage": 0,
                "drain": 0,
                "userPenalty": 0
        },
        "wis": {
            "value": 21,
                "damage": 0,
                "drain": 0,
                "userPenalty": 0
        },
        "cha": {
            "value": 18,
                "damage": 0,
                "drain": 0,
                "userPenalty": 0
        }
    },
    "attributes": {
        "hpAbility": "con",
            "cmbAbility": "str",
            "naturalAC": "",
            "ac": {
            "normal": {
                "ability": "dex"
            },
            "touch": {
                "ability": "dex"
            },
            "flatFooted": {}
        },
        "cmd": {
            "strAbility": "str",
                "dexAbility": "dex"
        },
        "sr": {
            "formula": ""
        },
        "clCheck": false,
            "saveNotes": "",
            "acNotes": "",
            "cmdNotes": "",
            "srNotes": "",
            "attack": {
            "meleeAbility": "str",
                "rangedAbility": "dex"
        },
        "energyDrain": 0,
            "quadruped": null,
            "savingThrows": {
            "fort": {
                "base": 0,
                    "ability": "con"
            },
            "ref": {
                "base": 0,
                    "ability": "dex"
            },
            "will": {
                "base": 0,
                    "ability": "wis"
            }
        },
        "hp": {
            "temp": 0,
                "nonlethal": 0,
                "offset": 0
        },
        "wounds": {
            "offset": 0,
                "min": 0,
                "base": 0,
                "max": 0
        },
        "vigor": {
            "temp": 0,
                "offset": 0,
                "min": 0,
                "base": 0,
                "max": 0
        },
        "init": {
            "value": 0,
                "ability": "dex"
        },
        "speed": {
            "land": {
                "base": 30
            },
            "climb": {
                "base": 0
            },
            "swim": {
                "base": 0
            },
            "burrow": {
                "base": 0
            },
            "fly": {
                "base": 0,
                    "maneuverability": "average"
            }
        },
        "spells": {
            "spellbooks": {
                "primary": {
                    "name": "Primary",
                        "inUse": true,
                        "castPerDayAllOffsetFormula": "",
                        "preparedAllOffsetFormula": "",
                        "casterType": "high",
                        "class": "cleric",
                        "cl": {
                        "formula": "",
                            "autoSpellLevelCalculationFormula": ""
                    },
                    "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "wis",
                        "autoSpellLevelCalculation": true,
                        "autoSpellLevels": true,
                        "psychic": false,
                        "arcaneSpellFailure": true,
                        "hasCantrips": true,
                        "spellPreparationMode": "prepared",
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spellPoints": {
                        "useSystem": false,
                            "value": 0,
                            "maxFormula": "",
                            "restoreFormula": ""
                    },
                    "spells": {
                        "spell0": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell1": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 1
                        },
                        "spell2": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell3": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell4": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell5": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 1
                        },
                        "spell6": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 1
                        },
                        "spell7": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell8": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell9": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        }
                    },
                    "spellSlotAbilityBonusFormula": "",
                        "domainSlotValue": 1,
                        "altName": "",
                        "kind": "arcane"
                },
                "secondary": {
                    "name": "Secondary",
                        "inUse": false,
                        "castPerDayAllOffsetFormula": "",
                        "preparedAllOffsetFormula": "",
                        "casterType": "high",
                        "class": "",
                        "cl": {
                        "formula": ""
                    },
                    "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "int",
                        "autoSpellLevelCalculation": true,
                        "autoSpellLevels": true,
                        "psychic": false,
                        "arcaneSpellFailure": true,
                        "hasCantrips": true,
                        "spellPreparationMode": "spontaneous",
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spellPoints": {
                        "useSystem": false,
                            "value": 0,
                            "maxFormula": "",
                            "restoreFormula": ""
                    },
                    "spells": {
                        "spell0": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell1": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell2": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell3": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell4": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell5": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell6": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell7": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell8": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell9": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        }
                    },
                    "spellSlotAbilityBonusFormula": "",
                        "domainSlotValue": 1,
                        "altName": ""
                },
                "tertiary": {
                    "name": "Tertiary",
                        "inUse": false,
                        "castPerDayAllOffsetFormula": "",
                        "preparedAllOffsetFormula": "",
                        "casterType": "high",
                        "class": "",
                        "cl": {
                        "formula": ""
                    },
                    "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "int",
                        "autoSpellLevelCalculation": true,
                        "autoSpellLevels": true,
                        "psychic": false,
                        "arcaneSpellFailure": true,
                        "hasCantrips": true,
                        "spellPreparationMode": "spontaneous",
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spellPoints": {
                        "useSystem": false,
                            "value": 0,
                            "maxFormula": "",
                            "restoreFormula": ""
                    },
                    "spells": {
                        "spell0": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell1": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell2": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell3": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell4": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell5": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell6": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell7": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell8": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell9": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        }
                    },
                    "spellSlotAbilityBonusFormula": "",
                        "domainSlotValue": 1,
                        "altName": ""
                },
                "spelllike": {
                    "name": "Spell-likes",
                        "inUse": false,
                        "castPerDayAllOffsetFormula": "",
                        "preparedAllOffsetFormula": "",
                        "casterType": "high",
                        "class": "_hd",
                        "cl": {
                        "formula": ""
                    },
                    "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "cha",
                        "autoSpellLevelCalculation": true,
                        "autoSpellLevels": true,
                        "psychic": false,
                        "arcaneSpellFailure": true,
                        "hasCantrips": true,
                        "spellPreparationMode": "spontaneous",
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spellPoints": {
                        "useSystem": false,
                            "value": 0,
                            "maxFormula": "",
                            "restoreFormula": ""
                    },
                    "spells": {
                        "spell0": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell1": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell2": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell3": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell4": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell5": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell6": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell7": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell8": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        },
                        "spell9": {
                            "castPerDayOffsetFormula": "",
                                "preparedOffsetFormula": "",
                                "value": 0
                        }
                    },
                    "spellSlotAbilityBonusFormula": "",
                        "domainSlotValue": 1,
                        "altName": ""
                }
            }
        },
        "cmb": {}
    },
    "details": {
        "height": "5'3\"",
            "weight": "105 lbs.",
            "gender": "Female",
            "deity": "???",
            "age": "(27) 227",
            "alignment": "cg",
            "biography": {
            "value": ""
        },
        "bonusFeatFormula": "",
            "bonusSkillRankFormula": "",
            "carryCapacity": {
            "bonus": {
                "user": 0
            },
            "multiplier": {
                "base": 1,
                    "user": 0
            }
        },
        "notes": {
            "value": ""
        },
        "xp": {
            "value": 0
        },
        "cr": {
            "base": 1
        },
        "mythicTier": 0
    },
    "skills": {
        "acr": {
            "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": 12
        },
        "apr": {
            "ability": "int",
                "rt": false,
                "acp": true,
                "rank": 1
        },
        "art": {
            "ability": "int",
                "rt": false,
                "acp": false,
                "rank": 0
        },
        "blf": {
            "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": null
        },
        "clm": {
            "ability": "str",
                "rt": false,
                "acp": true,
                "rank": null
        },
        "crf": {
            "ability": "int",
                "rt": false,
                "acp": false,
                "rank": 0,
                "subSkills": {
                "crf1": {
                    "name": "Figurines",
                        "ability": "int",
                        "rank": 12,
                        "rt": false,
                        "cs": true,
                        "acp": false,
                        "background": true
                }
            }
        },
        "dip": {
            "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 1
        },
        "dev": {
            "ability": "dex",
                "rt": true,
                "acp": true,
                "rank": null
        },
        "dis": {
            "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": null
        },
        "esc": {
            "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": null
        },
        "fly": {
            "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": null
        },
        "han": {
            "ability": "cha",
                "rt": true,
                "acp": false,
                "rank": null
        },
        "hea": {
            "ability": "wis",
                "rt": false,
                "acp": true,
                "rank": 1
        },
        "int": {
            "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": null
        },
        "kar": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "kdu": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": null
        },
        "ken": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": null
        },
        "kge": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": null
        },
        "khi": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "klo": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": null
        },
        "kna": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": null
        },
        "kno": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "kpl": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "kre": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "lin": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "lor": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0
        },
        "per": {
            "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 12
        },
        "prf": {
            "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "subSkills": {}
        },
        "pro": {
            "ability": "wis",
                "rt": true,
                "acp": false,
                "rank": 0
        },
        "rid": {
            "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": null
        },
        "sen": {
            "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 1
        },
        "slt": {
            "ability": "dex",
                "rt": true,
                "acp": true,
                "rank": null
        },
        "spl": {
            "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 1
        },
        "ste": {
            "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": null
        },
        "sur": {
            "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": null
        },
        "swm": {
            "ability": "str",
                "rt": false,
                "acp": true,
                "rank": null
        },
        "umd": {
            "ability": "cha",
                "rt": true,
                "acp": false,
                "rank": null
        }
    },
    "traits": {
        "size": "med",
            "ageCategory": "adult",
            "senses": {
            "dv": {
                "value": 0
            },
            "ts": {
                "value": 0
            },
            "bs": {
                "value": 0
            },
            "bse": {
                "value": 0
            },
            "ll": {
                "enabled": true,
                    "multiplier": {
                    "dim": 2,
                        "bright": 1
                }
            },
            "ls": {
                "value": 0
            },
            "sid": false,
                "tr": {
                "value": 0
            },
            "si": false,
                "sc": {
                "value": 0
            },
            "custom": ""
        },
        "hardness": 0,
            "dr": {
            "value": [],
                "custom": ""
        },
        "eres": {
            "value": [],
                "custom": ""
        },
        "cres": "",
            "regen": "",
            "fastHealing": "",
            "languages": [
            "common",
            "catfolk"
        ],
            "di": [],
            "dv": [],
            "ci": [],
            "stature": "tall",
            "weaponProf": [],
            "armorProf": [],
            "aura": {
            "custom": ""
        }
    },
    "currency": {
        "pp": 0,
            "gp": 0,
            "sp": 0,
            "cp": 0
    },
    "altCurrency": {
        "pp": 0,
            "gp": 130590,
            "sp": 0,
            "cp": 0
    },
    "customSkills": {}
},
    "ownership": {
    "default": 0,
        "GiVVSvNiUU3QweaA": 3
},
    "prototypeToken": {
    "name": "Nao",
        "displayName": 30,
        "actorLink": true,
        "width": 1,
        "height": 1,
        "lockRotation": false,
        "rotation": 0,
        "alpha": 1,
        "disposition": 1,
        "displayBars": 50,
        "bar1": {
        "attribute": "attributes.hp"
    },
    "bar2": {
        "attribute": null
    },
    "flags": {
        "pf1": {
            "disableLowLight": true,
                "lowLightVisionMultiplier": null,
                "lowLightVisionMultiplierBright": null,
                "staticSize": false,
                "customVisionRules": false
        },
        "token-auras": {
            "aura1": {
                "colour": "#ffffff",
                    "opacity": 0.5,
                    "distance": null,
                    "square": false,
                    "permission": "all"
            },
            "aura2": {
                "colour": "#ffffff",
                    "opacity": 0.5,
                    "distance": null,
                    "square": false,
                    "permission": "all"
            }
        },
        "perfect-vision": {
            "visionRules": "default",
                "monoVisionColor": "",
                "sightLimit": null,
                "_version": 1,
                "light": {}
        },
        "core": {},
        "Rideable": {
            "issetRideableFlag": true,
                "MaxRiderFlag": null,
                "CustomRidingheightFlag": null,
                "UseRidingHeightFlag": true,
                "RidersScaleFlag": 1,
                "RiderPositioningFlag": "RowPlacement",
                "RiderOffsetFlag": [
                0,
                0
            ],
                "TokenFormFlag": "TokenFormCircle",
                "InsideMovementFlag": false,
                "SpawnRidersFlag": "",
                "canbeGrappledFlag": true,
                "CanbePilotedFlag": false,
                "PilotedbyDefaultFlag": false,
                "CheckPilotedCollisionFlag": false
        },
        "8bit-movement": {
            "oldPosition": {
                "x": 10400,
                    "y": 7000
            }
        },
        "grid-aware-auras": {
            "auras": [
                {
                    "name": "Combat Patrol M",
                    "enabled": true,
                    "radius": 6,
                    "lineType": 2,
                    "lineWidth": 4,
                    "lineColor": "#FF0000",
                    "lineOpacity": 0.3,
                    "lineDashSize": 15,
                    "lineGapSize": 10,
                    "fillType": 1,
                    "fillColor": "#FF0000",
                    "fillOpacity": 0,
                    "fillTexture": "\n\t\t\t",
                    "fillTextureOffset": {
                        "x": 0,
                        "y": 0
                    },
                    "fillTextureScale": {
                        "x": 100,
                        "y": 100
                    },
                    "ownerVisibility": {
                        "default": false,
                        "hovered": true,
                        "controlled": false,
                        "dragging": false,
                        "targeted": false,
                        "turn": false
                    },
                    "nonOwnerVisibility": {
                        "default": false,
                        "hovered": true,
                        "targeted": false,
                        "turn": false
                    },
                    "effect": {
                        "effectId": "",
                        "isOverlay": true,
                        "targetTokens": "HOSTILE"
                    },
                    "macro": {
                        "macroId": ""
                    },
                    "terrainHeightTools": {
                        "rulerOnDrag": "NONE",
                        "targetTokens": "ALL"
                    },
                    "id": "YBBkGCQH4mbk9VFJ"
                }
            ]
        },
        "image-hover": {
            "hideArt": false,
                "specificArt": "path/image.png"
        }
    },
    "randomImg": false,
        "light": {
        "alpha": 0,
            "angle": 360,
            "bright": 20,
            "coloration": 1,
            "dim": 40,
            "luminosity": 0.5,
            "saturation": 0,
            "contrast": 0,
            "shadows": 0,
            "animation": {
            "speed": 5,
                "intensity": 5,
                "type": null,
                "reverse": false
        },
        "darkness": {
            "min": 0,
                "max": 1
        },
        "color": "#8000ff",
            "attenuation": 0.5,
            "negative": false,
            "priority": 0
    },
    "texture": {
        "src": "assets/heavy-rain/icons/player-icons/nao/846e31ba-b24c-4f24-8075-74f9a23891ef.webp",
            "tint": "#ffffff",
            "scaleX": 1,
            "scaleY": 1,
            "offsetX": 0,
            "offsetY": 0,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0.5,
            "fit": "contain",
            "alphaThreshold": 0.75
    },
    "sight": {
        "angle": 360,
            "enabled": true,
            "range": 30,
            "brightness": 1,
            "visionMode": "basic",
            "color": null,
            "attenuation": 0.1,
            "saturation": 0,
            "contrast": 0
    },
    "detectionModes": [],
        "appendNumber": false,
        "prependAdjective": false,
        "hexagonalShape": 0,
        "occludable": {
        "radius": 0
    },
    "ring": {
        "enabled": false,
            "colors": {
            "ring": null,
                "background": null
        },
        "effects": 0,
            "subject": {
            "scale": 1,
                "texture": null
        }
    }
},
    "_stats": {
    "systemId": "pf1",
        "systemVersion": "11.5",
        "coreVersion": "12.331",
        "createdTime": 1696102379696,
        "modifiedTime": 1748148361283,
        "lastModifiedBy": "GiVVSvNiUU3QweaA",
        "compendiumSource": null,
        "duplicateSource": null
},
    "_id": "GG2NGVTvkQA9V2iJ"
}
