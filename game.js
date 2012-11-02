var game_types = {
  'hd': "Symmetric, Hawk-Dove"
, 'pd': "Symmetric, Prisoner's Dilemma"
, 'pl': "Symmetric, Prisoner's Delight"
, 'sh': "Symmetric, Stag Hunt"
, 'edge': "Symmetric, Edge Case"
, 'mp': "Asymmetric, Matching Pennies"
, 'bos': "Asymmetric, Battle of the Sexes"
, 'zsum': "Asymmetric, Zero-Sum"
};

module.exports = {
  is_symmetric: is_symmetric
, identify: identify_game
, is_battleofthesexes: is_battleofthesexes
, is_matchingpennies: is_matchingpennies
, is_zerosum: is_zerosum
, get_type: get_game_type
};

/**
 * Determines if the game is symmetric or not
 */
function is_symmetric(game){
  return  (game['tl-r'] || 0) == (game['tl-c'] || 0) &&
          (game['tr-r'] || 0) == (game['bl-c'] || 0) &&
          (game['bl-r'] || 0) == (game['tr-c'] || 0) &&
          (game['br-r'] || 0) == (game['br-c'] || 0);
}

/**
 * Classifies the game
 *
 */
function identify_game(game){
  if (!is_symmetric(game)){
    return is_battleofthesexes(game) || is_matchingpennies(game) || is_zerosum(game) || false;
  }
  
  var a = (game['tl-r'] || 0) - (game['bl-r'] || 0);
  var b = (game['br-r'] || 0) - (game['tr-r'] || 0);

  if (a > 0 && b > 0) {
      return 'sh';
  }
  else if (a > 0 && b < 0) {
      return 'pl';
  }
  else if (a < 0 && b > 0) {
      return 'pd';
  }
  else if (a < 0 && b < 0) {
      return 'hd';
  }
  else {
      return 'edge';
  }
}

/**
 * Determines if the game is a Battle of the Sexes
 *
 */
function is_battleofthesexes(game){
  var min = Math.min(game['tl-r'], game['tl-c'], game['tr-r'], game['tl-c'],
          game['bl-r'], game['bl-c'], game['br-r'], game['br-c']);

  var game2 = {};

  game2['tl-r'] = game['tl-r'] - min;
  game2['tr-r'] = game['tr-r'] - min;
  game2['bl-r'] = game['bl-r'] - min;
  game2['br-r'] = game['br-r'] - min;
  game2['tl-c'] = game['tl-c'] - min;
  game2['tr-c'] = game['tr-c'] - min;
  game2['bl-c'] = game['bl-c'] - min;
  game2['br-c'] = game['br-c'] - min;

  if (Math.min(game2['tr-r'], game2['tr-c'], game2['bl-r'], game2['bl-c']) == 0 &&
      Math.max(game2['tr-r'], game2['tr-c'], game2['bl-r'], game2['bl-c']) == 0 &&
      (game2['tl-r'] - game2['tl-c']) * (game2['br-r'] - game2['br-c']) < 0){
          return 'bos';
  }

  if (Math.min(game2['tl-r'], game2['tl-c'], game2['br-r'], game2['br-c']) == 0 &&
      Math.max(game2['tl-r'], game2['tl-c'], game2['br-r'], game2['br-c']) == 0 &&
      (game2['tr-r'] - game2['tr-c']) * (game2['bl-r'] - game2['bl-c']) < 0){
          return 'bos';
  }

  return false;
}

/**
 * Determines if the game is a Matching Pennies
 *
 */
function is_matchingpennies(game){
  return  is_zerosum(game) &&
          (game['tl-r'] + game['tr-r'] == 0) &&
          (game['tl-r'] + game['bl-r'] == 0) &&
          (game['bl-r'] + game['br-r'] == 0) ? 'mp' : false;
}

/**
 * Determines if the game is zero-sum
 *
 */
function is_zerosum(game){
  return  (game['tl-r'] + game['tl-c'] == 0) &&
          (game['tr-r'] + game['tr-c'] == 0) &&
          (game['bl-r'] + game['bl-c'] == 0) &&
          (game['br-r'] + game['br-c'] == 0) ? 'zsum' : false;
}

/**
 * Get the name of the type of the game
 *
 */
function get_game_type(game){
  return game_types[identify_game(game)] || "Asymmetric";
}
