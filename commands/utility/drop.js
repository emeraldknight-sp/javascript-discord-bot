const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("drop").setDescription("Draw cards"),
  async execute(interaction) {
    const cards = [
      {
        // id: "1hrmbt",
        id: 123,
        name: "Fulano",
        group: "BTS",
        rarity: {
          quantity: 1,
          type: "hobinite",
          icon: "✿❀❀❀❀",
        },
        copies: 0,
        isEvent: false,
      },
      {
        id: 456,
        name: "Sicrano",
        group: "BTS",
        rarity: {
          quantity: 2,
          type: "hobinite",
          icon: "✿✿❀❀❀",
        },
        copies: 1,
        isEvent: false,
      },
      {
        id: 789,
        name: "Beltrano",
        group: "BTS",
        rarity: {
          quantity: 5,
          type: "hobinite",
          icon: "✿✿✿✿✿",
        },
        copies: 0,
        isEvent: false,
      },
      {
        // id: "1hrmbt",
        id: 120,
        name: "Japãozim",
        group: "BTS",
        rarity: {
          quantity: 2,
          type: "hobinite",
          icon: "✿✿❀❀❀",
        },
        copies: 3,
        isEvent: false,
      },
      {
        id: 130,
        name: "Coreiazinha",
        group: "BTS",
        rarity: {
          quantity: 4,
          type: "hobinite",
          icon: "✿✿✿✿❀",
        },
        copies: 2,
        isEvent: false,
      },
      {
        id: 140,
        name: "Chininha",
        group: "BTS",
        rarity: {
          quantity: 3,
          type: "hobinite",
          icon: "✿✿✿❀❀",
        },
        copies: 0,
        isEvent: false,
      },
    ];

    // This small code selects, with the help of the Set object,
    // 3 unique elements, that is, that are not repeated during a draw.

    const randomCards = () => {
      if (cards.length < 3) {
        throw new Error("Must have at least 3 elements");
      }

      const setCards = new Set();

      while (setCards.size < 3) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        setCards.add(randomIndex);
      }

      const chosenCards = Array.from(setCards).map((index) => cards[index]);

      return chosenCards;
    };

    const selectedCards = randomCards();

    const embeddedMessage = new EmbedBuilder()
      .setColor("#DCB945")
      .setTitle("Results of the drop!")
      .addFields(
        {
          name: `Card #1 (${selectedCards[0].id})`,
          value: `${selectedCards[0].name} ${selectedCards[0].group}
          ${selectedCards[0].rarity.icon}
          
          ${selectedCards[0].copies > 1 ? `**Copies:** ${selectedCards[0].copies}` : "No one"}`,
        },
        {
          name: `Card #2 (${selectedCards[1].id})`,
          value: `${selectedCards[1].name} ${selectedCards[1].group}
          ${selectedCards[1].rarity.icon}
                    
          ${selectedCards[1].copies > 1 ? `**Copies:** ${selectedCards[1].copies}` : "No one"}`,
        },
        {
          name: `Card #3 (${selectedCards[2].id})`,
          value: `${selectedCards[2].name} ${selectedCards[2].group}
          ${selectedCards[2].rarity.icon}
                    
          ${selectedCards[2].copies > 1 ? `**Copies:** ${selectedCards[2].copies}` : "No one"}`,
        },
      )
      .setFooter({
        iconURL: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`,
        text: `${interaction.client.user.username}`,
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embeddedMessage] });
  },
};
