const helpRequestFixtures = {
    oneHelpRequest:
    [
      {
       "id": 1,
        "requesterEmail": "winstonwang@ucsb.edu",
        "teamId": "4pm-5",
        "tableOrBreakoutRoom": "5",
        "requestTime": "2022-01-03T00:00:00",
        "explanation": "dokku problem",
        "solved": true   
      }
    ],

    threeHelpRequests:
    [
        {
            "id": 1,
            "requesterEmail": "ww@ucsb.edu",
            "teamId": "4pm-6",
            "tableOrBreakoutRoom": "6",
            "requestTime": "2020-04-05T00:00:00",
            "explanation": "frontend issue",
            "solved": false      
        },

        {
            "id": 2,
            "requesterEmail": "winstonw@ucsb.edu",
            "teamId": "4pm-7",
            "tableOrBreakoutRoom": "7",
            "requestTime": "2021-02-02T00:00:00",
            "explanation": "mutation testing",
            "solved": true    
        },

        {
            "id": 3,
            "requesterEmail": "wwang@ucsb.edu",
            "teamId": "4pm-8",
            "tableOrBreakoutRoom": "8",
            "requestTime": "2024-05-08T00:00:00",
            "explanation": "issue with javascript",
            "solved": false      
        },
        
    ]
};

export { helpRequestFixtures };
