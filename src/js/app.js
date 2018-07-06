App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  artist_0: '0x0',
  investor_balance: 0,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("PatreonToken.json", function(patreonToken) {
      App.contracts.PatreonToken = TruffleContract(patreonToken);
      App.contracts.PatreonToken.setProvider(App.web3Provider);
      App.contracts.PatreonToken.deployed().then(function(patreonToken) {
        console.log("PatreonToken Address:", patreonToken.address);
      });

      App.listenForEvents();
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.PatreonToken.deployed().then(function(instance) {
      instance.Buy({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        // console.log("event triggered", event);
        App.render();
      })
    })
    /*.then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })*/
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        console.log("Account address: " + account)
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    artist_0 = web3.eth.accounts[0];

    // Load token contract
    App.contracts.PatreonToken.deployed().then(function(instance) {
      patreonTokenInstance = instance;
      return patreonTokenInstance.tokenBalance(App.account);
    }).then(function(balance) {
      investor_balance = balance;
      $('#investTokens').attr("max",investor_balance);
      $('.token-balance').html("Balance: "+balance.toNumber()+" Tokens");
      $('.my-total-token').html("My Total Tokens: <h6>"+balance.toNumber()+"</h6>");
      App.loading = false;
    })

    App.contracts.PatreonToken.deployed().then(function(instance) {
      patreonTokenInstance = instance;
      return patreonTokenInstance.artistBalance(artist_0);
    }).then(function(balance) {
      $('.artist-balance').html(balance.toNumber()+"K");
      App.loading = false;
    })

  },

  buyTokens: function() {
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.PatreonToken.deployed().then(function(instance) {
      return instance.buy(numberOfTokens, {
        from: App.account,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Buy event
      // return App.render();
      location.reload();
    });
  },

  sellTokens: function() {
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.PatreonToken.deployed().then(function(instance) {
      return instance.sell(numberOfTokens, {
        from: App.account,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens sold...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Buy event
      // return App.render();
      location.reload();
    });
  },

  contributeInArtist: function() {
    var investTokens = $('#investTokens').val();
    App.contracts.PatreonToken.deployed().then(function(instance) {
      return instance.contribute(investTokens, artist_0, {
        from: App.account,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens sold..." + result)
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Buy event
      // return App.render();
      location.reload();
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
